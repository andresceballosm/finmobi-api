import { Response } from "express";
import { TITLE_ERROR } from "../constants/messages.constants";
import { validateListing } from "../validations/listing.validation";
const axios = require("axios");

export async function create(req: any, res: Response) {
  try {
    const { email, type } = req.body;

    const validation = validateListing(req.body);
    if (validation.err) {
      return res.status(400).send({
        ok: false,
        response: {
          msg: validation.message,
          code: "app-missing-fields",
        },
      });
    }

    console.log("email ", email);
  } catch (error) {
    console.log("error", error);
    return res.status(400).send({
      error: true,
      message: {
        title: TITLE_ERROR,
        message: "error",
      },
      response: null,
    });
  }
}
