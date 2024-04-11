import { Response } from "express";
import { TITLE_ERROR } from "../constants/messages.constants";
import { LeaseRequest, Link } from "../models/lease-request.model";
import { getAccountLink, getOwnerService } from "../services/belvo.service";
import { validateLeaseRequest } from "../validations/lease.validation";
const belvo = require("belvo").default;

export async function getLeaseRequest(req: any, res: Response) {
  try {
    const { id } = req.params;
    const leaseRequest = await LeaseRequest.findById(id);
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
    const { id } = req.params;
    const leaseRequest = await LeaseRequest.findByIdAndUpdate(
      id,
      { status: "owner-rejected" },
      {
        upsert: true,
      },
    );
    if (leaseRequest) {
      return res.status(200).send({
        error: false,
        message: null,
        response: null,
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

export async function accountsByLease(req: any, res: Response) {
  try {
    const leaseRequest = await LeaseRequest.findById(req.params.id);
    const lease = leaseRequest.transform();

    if (lease?.links.length === 0) {
      return res.json({
        error: true,
        accepted: false,
        response:
          "Lo sentimos, no es posible proceder en este momento con el analisis, debe primero conectar una cuenta bancaria.",
      });
    }

    if (lease?.status !== "in-process") {
      return res.json({
        error: true,
        accepted: false,
        response:
          "Lo sentimos, esta solicitud ya no esta vigente, por favor inicie una nueva solicitud.",
      });
    }

    const client = new belvo(
      process.env.BELVO_SECRET_ID,
      process.env.BELVO_SECRET_PASSWORD,
      process.env.BELVO_ENV,
    );

    await client.connect();
    const accountsLinks = lease.links || [];
    const accounts: any = [];

    for (const account of accountsLinks) {
      const responseAccount = await getAccountLink(client, account.link);
      if (!responseAccount.error) {
        accounts.push(responseAccount.accounts);
      }
    }

    res.status(200).send({
      error: false,
      accounts,
    });
  } catch (error) {
    console.log("error", error);
    return res.status(500).send({
      error: true,
      message: {
        title: TITLE_ERROR,
        message: "error",
      },
      response: null,
    });
  }
}

export async function createLeaseRequest(req: any, res: Response) {
  try {
    const validation = validateLeaseRequest(req);
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
    const { includeAdmon, amount, admon } = data;
    const total = includeAdmon
      ? parseFloat(amount)
      : parseFloat(amount) + parseFloat(admon);
    const fee = total * 0.05;
    const service = total * 0.05 + total;

    Object.assign(data, { fee, total: service });

    const leaseRequest = await new LeaseRequest(req.body).save();
    const leaseRequestTransformed = leaseRequest.transform();
    return res.status(201).send({
      error: false,
      message: {
        title: "Felicitaciones",
        message: "La solicitud fue creada",
      },
      leaseRequestTransformed,
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

export async function removeLinkLeaseRequest(req: any, res: Response) {
  try {
    const { linkID, id } = req.body;
    if (!linkID || !id) {
      return res.status(400).send({
        ok: false,
        response: {
          msg: "Falta el link o el id del lease",
          code: "app-missing-fields",
        },
      });
    }

    const remove = await LeaseRequest.updateOne(
      { _id: id },
      { $pull: { links: { _id: linkID } } },
      { safe: true, multi: false },
    );

    const leaseRequest = await LeaseRequest.findById(id);
    const lease = leaseRequest.transform();

    return res.send({
      error: false,
      message: {
        title: "Felicitaciones",
        message: "Cuenta eliminada",
      },
      lease,
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

export async function updateLeaseRequest(req: any, res: Response) {
  try {
    const { ...rest } = req.body;
    const leaseRequest = await LeaseRequest.findByIdAndUpdate(
      req.body.id,
      rest,
      {
        upsert: true,
      },
    );
    if (leaseRequest) {
      const leaseRequestTransformed = leaseRequest.transform();
      const newLeaseRequest = {
        ...leaseRequestTransformed,
        ...rest,
      };
      return res.status(200).send({
        error: false,
        message: null,
        response: newLeaseRequest,
      });
    } else {
      return res.status(400).send({
        error: true,
        message: {
          title: TITLE_ERROR,
          message: "La solicitud no fue encontrada",
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

export async function addLinkToLease(req: any, res: Response) {
  try {
    const { link, institution } = req.body.link;

    const leaseRequest = await LeaseRequest.findById(req.body.id);
    const lease = leaseRequest.transform();

    if (lease?.links) {
      const exist = lease.links.find(
        (link: Link) => link.institution === institution,
      );
      if (exist) {
        return res.send({
          error: true,
          message: {
            title: TITLE_ERROR,
            message: "Esta entidad bancaria ya fue conectada",
          },
          response: null,
        });
      }
    }

    const client = new belvo(
      process.env.BELVO_SECRET_ID,
      process.env.BELVO_SECRET_PASSWORD,
      process.env.BELVO_ENV,
    );

    await client.connect();

    const responseOwner = await getOwnerService(client, link);
    if (responseOwner.error) {
      return res.json(responseOwner);
    }

    const documentNumer =
      responseOwner?.owner[0].document_id.document_number || 0;

    if (
      lease.tenantDocumentId != documentNumer &&
      process.env.BELVO_ENV !== "sandbox"
    ) {
      return res.send({
        error: true,
        message: {
          title: TITLE_ERROR,
          message:
            "Lo sentimos, el número de entidad del propietario de la cuenta bancaria que trata de conectar no coincide con su número de identidad registrado.",
        },
        response: null,
      });
    }

    LeaseRequest.updateOne(
      { _id: req.body.id },
      {
        $push: { links: { link, institution } },
      },
      { upsert: true },
    )
      .then((result: any) => {
        return res.status(200).send({
          error: false,
          message: null,
          response: null,
        });
      })
      .catch((error: any) => {
        return res.status(400).send({
          error: true,
          message: {
            title: TITLE_ERROR,
            message: "La solicitud no fue encontrada",
          },
          response: null,
        });
      });
  } catch (error) {
    return res.status(500).send({
      error: true,
      message: {
        title: TITLE_ERROR,
        //@ts-ignore
        message: error.message,
      },
      response: null,
    });
  }
}
