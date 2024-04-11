import { Request, Response } from "express";
import { Logger } from "@overnightjs/logger";
import { runQuery } from "../services/diagoflow.service";
import { sendSmsWhatsAppService } from "../services/twilio-whatsapp.service";

export async function postMessage(req: Request, res: Response) {
  Logger.Info("A post request has been received");

  const { Body, To, From } = req.body;

  // Here we're sending the received message to Dialogflow so that it can be identified against an Intent.
  runQuery(Body, From)
    .then((result: any) => {
      sendSmsWhatsAppService(From, To, result.fulfillmentText)
        .then((res) => {
          console.log(res);
        })
        .catch((error) => {
          console.error("error is ", error);
          Logger.Err(error);
        });
    })
    .catch((error) => {
      console.error("error is ", error);
      Logger.Err(error);
    });
  return res.status(200).send("SUCCESS");
}
