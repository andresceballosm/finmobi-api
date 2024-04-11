import { Response } from "express";
import { TITLE_ERROR } from "../constants/messages.constants";
import { Quote } from "../models/quote.model";
import { validateQuote } from "../validations/quote.validation";

export async function createQuote(req: any, res: Response) {
  try {
    const validation = validateQuote(req);
    if (validation.err) {
      return res.status(400).send({
        ok: false,
        response: {
          msg: validation.message,
          code: "app-missing-fields",
        },
      });
    }

    const data = req.body;
    const admon = data?.admon ? parseFloat(data.admon) : 0;
    const leaseAmount = parseFloat(data.amount) + admon;
    const fee = leaseAmount * 0.05;
    const total = parseFloat(data.amount) + admon + fee;
    Object.assign(data, { fee });
    const quote = await new Quote(data).save();

    const amountFormat = data.amount.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
      useGrouping: true,
    });

    const feeFormat = fee.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
      useGrouping: true,
    });

    const totalFormat = total.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
      useGrouping: true,
    });

    return res.status(201).send({
      error: false,
      message: {
        title: "Felicitaciones",
        message: `Debera pagar mensualmente su canon de arrendamiento que es de $${amountFormat} + $${feeFormat}(servicio de Finmobi) que en total suman $${totalFormat}`,
      },
      quote: {
        id: quote._id,
        amount: leaseAmount,
        fee,
        total,
      },
    });
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

export async function updateQuote(req: any, res: Response) {
  try {
    const { ...rest } = req.body;
    console.log("req ", req.body);
    const quote = await Quote.findByIdAndUpdate(req.body.id, rest, {
      upsert: true,
    });
    console.log("quote", quote);
    if (quote) {
      const quoteTransformed = quote.transform();
      const newQuote = {
        ...quoteTransformed,
        ...rest,
      };
      return res.status(200).send({
        error: false,
        message: null,
        response: newQuote,
      });
    } else {
      return res.status(400).send({
        error: true,
        message: {
          title: TITLE_ERROR,
          message: "La cotizacion no fue encontrada",
        },
        response: null,
      });
    }
  } catch (error) {
    console.log("error ", error);
    return res.status(500).send({
      error: true,
      message: {
        title: TITLE_ERROR,
        message: error,
      },
      response: null,
    });
  }
}
