import { Response } from "express";
import { TITLE_ERROR } from "../constants/messages.constants";
import { CancellationReason } from "../models/lease-cancellation.model";
import { LeaseRequest } from "../models/lease-request.model";

export async function getLeaseCancellation(req: any, res: Response) {
  try {
    const { id } = req.params;
    const leaseRequest = await CancellationReason.findById(id);
    if (leaseRequest) {
      const leaseRequestTransformed = leaseRequest.transform();
      return res.status(200).send({
        error: false,
        message: null,
        response: leaseRequestTransformed,
      });
    } else {
      return res.status(400).send({
        error: true,
        message: {
          title: TITLE_ERROR,
          message: "No se pudo encontrar la solicitud",
        },
        response: null,
      });
    }
  } catch (error) {
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

export async function cancelLeaseRequest(req: any, res: Response) {
  try {
    await new CancellationReason(req.body).save();

    const leaseRequest = await LeaseRequest.findByIdAndUpdate(
      req.body.leaseID,
      { status: "owner-rejected" },
      {
        upsert: true,
      },
    );

    return res.status(200).send({
      error: false,
      message: {
        title: "Solicitud cancelada",
        message: "La solicitud ha sido cancelada satisfactoriamente.",
      },
      response: null,
    });
  } catch (error) {
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
