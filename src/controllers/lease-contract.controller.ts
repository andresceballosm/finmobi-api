import { Response } from "express";
import { TITLE_ERROR } from "../constants/messages.constants";
import {
  ItemBill,
  LeaseBill,
  LeaseBillInput,
} from "../models/lease-bill.model";
import { CancellationReason } from "../models/lease-cancellation.model";
import { LeaseContract } from "../models/lease-contract.model";
import { LeaseRequest } from "../models/lease-request.model";
import { createContractZapSignService } from "../services/lease-contract.service";
import { sendSmsWhatsAppService } from "../services/twilio-whatsapp.service";
const moment = require("moment-timezone");

export async function getLeaseContract(req: any, res: Response) {
  try {
    const { id } = req.params;
    const leaseContract = await LeaseContract.findById(id);
    if (leaseContract) {
      const leaseContractTransformed = leaseContract.transform();
      return res.status(200).send({
        error: false,
        message: null,
        response: leaseContractTransformed,
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

export async function validateSignedContract(req: any, res: Response) {
  try {
    const { status, external_id } = req.body;
    const leaseRequest = LeaseRequest.findById(external_id);
    const lease = leaseRequest.transform();
    const contractLease = LeaseContract.findOne({ leaseID: external_id });
    if (contractLease) {
      const contractLeaseTransformed = contractLease.transform();
      const { tenantPhone, ownerPhone, start } = contractLeaseTransformed;
      const { amount, admon, fee, total } = lease;
      const day = new Date(start).getDate();
      const dateStart = moment.tz(new Date(start), "America/Bogota");
      const dateLimit = moment(dateStart)
        .add(5, "d")
        .format();
      const nextPayment = moment(dateStart)
        .add(30, "d")
        .format();

      const items: [ItemBill] = [
        {
          name: `Pago arriendo`,
          amount: parseFloat(amount) + parseFloat(admon),
          description: `Pago de arriendo periodo ${start} a ${nextPayment}`,
        },
      ];

      if (status === "signed") {
        const billData: LeaseBillInput = {
          leaseID: external_id,
          contractID: contractLeaseTransformed.id,
          dateLimit,
          items,
          fee,
          total,
          subtotal: total,
          link: "www.pse.com",
        };

        const bill = await new LeaseBill(billData).save();

        const from = "+15073387751";
        const messageToEveryOne = `🎉Felicidades el contrato ha sido firmado por todas las partes, para nosotros es un placer darle la bienvenida a Finmobi, y esperamos ser un gran aliado para usted de ahora en adelante.`;
        const messageOwner = `Recuerde que Finmobi se compromete a depositar en su cuenta bancaria cada mes el pago del arriendo, aunque su inquilino se atrase. Nuestro compromiso es realizar el depósito dentro de los primeros 7 días calendario a partir del día ${day} de cada mes.`;
        const messageTenant = `Recuerde que su compromiso es realizar el primer pago inmediatamente a través de Finmobi para que el contrato entre en vigencia, y en los siguientes meses realizar el pago a través de Finmobi dentro de los primeros 5 días calendario a partir del día ${day} de cada mes.`;
        const messageTenantBill = `👋 Hola!, hemos generado la factura del pago del arriendo. Por favor ingrese al siguiente link para hacer el pago de su arriendo desde la comodidad de su casa: ${billData.link}`;
        await sendSmsWhatsAppService(
          tenantPhone,
          from,
          messageToEveryOne,
          true,
        );
        await sendSmsWhatsAppService(ownerPhone, from, messageToEveryOne, true);
        await sendSmsWhatsAppService(ownerPhone, from, messageOwner, true);
        await sendSmsWhatsAppService(tenantPhone, from, messageTenant, true);
        await sendSmsWhatsAppService(
          tenantPhone,
          from,
          messageTenantBill,
          true,
        );
      }
    }
  } catch (error) {}
}

export async function createLeaseContract(req: any, res: Response) {
  try {
    const {
      ownerDocumentId,
      ownerAddress,
      ownerFirstName,
      ownerEmail,
      ownerCityDocumentExpedition,
      ownerLastName,
      ownerPhone,
      leaseID,
      ownerTypeDocument,
      finishContract,
      startContract,
    } = req.body;
    const leaseRequest = await LeaseRequest.findById(leaseID);
    if (leaseRequest) {
      const leaseRequestTransformed = leaseRequest.transform();
      const {
        address,
        tenantFirstName,
        tenantLastName,
        tenantDocumentId,
        tenantCityDocumentExpedition,
        tenantEmail,
        tenantPhone,
        tenantTypeDocument,
        total,
      } = leaseRequestTransformed;

      const dayOne = new Date(startContract).getDate();

      const contractSign = await createContractZapSignService({
        address,
        leaseID,
        ownerFirstName,
        ownerLastName,
        ownerAddress,
        ownerDocumentId,
        ownerEmail,
        ownerCityDocumentExpedition,
        ownerPhone,
        tenantFirstName,
        tenantLastName,
        tenantDocumentId,
        tenantCityDocumentExpedition,
        tenantEmail,
        tenantPhone,
        total,
        dayOne,
      });

      if (!contractSign?.error && contractSign?.response) {
        const { open_id, signers } = contractSign?.response;
        const dataContract = {
          leaseID,
          //@ts-ignore
          links: [signers[0].sign_url, signers[1].sign_url],
          finish: finishContract,
          ownerAddress,
          ownerCityDocumentExpedition,
          ownerDocumentId,
          ownerEmail,
          ownerFirstName,
          ownerLastName,
          ownerPhone,
          ownerTypeDocument,
          start: startContract,
          status: "open",
          tenantDocumentId,
          tenantEmail,
          tenantFirstName,
          tenantLastName,
          tenantPhone,
          tenantTypeDocument,
          tenantCityDocumentExpedition,
          contractSignID: open_id,
        };

        const leaseContract = await new LeaseContract(dataContract).save();
        console.log("leaseContract ", leaseContract);
        const leaseContractTransformed = leaseContract.transform();

        const from = "+15073387751";
        const to = leaseContractTransformed.ownerPhone;
        const messageToTenant = `👋 Tenemos una buena noticia para tí, estamos 🚀acelerando el proceso de arrendamiento, ya el contrato de arrendamiento esta listo, solo necesitamos que firmes. 

        Para firmar 📃contrato abrir el siguiente link: ${signers[1].sign_url}`;
        const messageToOwner = `👋 Tenemos una buena noticia para tí, estamos 🚀acelerando el proceso de arrendamiento, ya el contrato de arrendamiento esta listo, solo necesitamos que firmes. 

        Para firmar 📃contrato abrir el siguiente link: ${signers[0].sign_url}`;

        const smsOwner = await sendSmsWhatsAppService(
          to,
          from,
          messageToOwner,
          true,
        );

        const smsTenant = await sendSmsWhatsAppService(
          leaseContractTransformed.tenantPhone,
          from,
          messageToTenant,
          true,
        );

        if (!smsOwner.error && !smsTenant.error) {
          return res.status(200).send({
            error: false,
            message:
              "Felicidades, el contrato ha sido generado. Recibirá instrucciones para la firma del mismo por WhatsApp.",
            response: leaseContractTransformed,
          });
        }
      }
    }

    return res.status(400).send({
      error: true,
      message: {
        title: TITLE_ERROR,
        message: "No se pudo crear el contrato",
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
