import { TITLE_ERROR } from "../constants/messages.constants";

const axios = require("axios");

export interface CreateContractZapSing {
  address: string;
  leaseID: string;
  ownerFirstName: string;
  ownerLastName: string;
  ownerAddress: string;
  ownerDocumentId: number;
  ownerEmail: string;
  ownerCityDocumentExpedition: string;
  ownerPhone: number;
  tenantFirstName: string;
  tenantLastName: string;
  tenantDocumentId: number;
  tenantCityDocumentExpedition: string;
  tenantEmail: string;
  tenantPhone: number;
  total: number;
  dayOne: number;
}

export async function createContractZapSignService({
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
}: CreateContractZapSing) {
  try {
    const response = await axios({
      method: "post",
      url: `${process.env.ZAP_SIGN_URL}/v1/models/create-doc/?api_token=${process.env.ZAP_SIGN_TOKEN}`,
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        template_id: "62961405-7076-4144-a711-87eb3e2a770e",
        external_id: leaseID,
        folder_path: "Contract Lease",
        reminder_every_n_days: 1,
        sandbox: true,
        signer_name: ownerFirstName + " " + ownerLastName,
        lang: "es",
        data: [
          {
            de: "{{NOMBRE COMPLETO PROPIETARIO}}",
            para: ownerFirstName + " " + ownerLastName,
          },
          {
            de: "{{DIRECCIÓN PROPIETARIO}}",
            para: ownerAddress,
          },
          {
            de: "{{NÚMERO IDENTIDAD PROPIETARIO}}",
            para: ownerDocumentId,
          },
          {
            de: "{{EMAIL PROPIETARIO}}",
            para: ownerEmail,
          },
          {
            de: "{{CIUDAD DE EXPEDICIÓN DOCUMENTO PROPIETARIO}}",
            para: ownerCityDocumentExpedition,
          },
          {
            de: "{{DIRECCIÓN INMUEBLE}}",
            para: address,
          },
          {
            de: "{{TELEFONO PROPIETARIO}}",
            para: ownerPhone,
          },
          {
            de: "{{NOMBRE COMPLETO INQUILINO}}",
            para: tenantFirstName + " " + tenantLastName,
          },
          {
            de: "{{NÚMERO IDENTIDAD INQUILINO}}",
            para: tenantDocumentId,
          },
          {
            de: "{{CIUDAD DE EXPEDICIÓN DOCUMENTO INQUILINO}}",
            para: tenantCityDocumentExpedition,
          },
          {
            de: "{{EMAIL INQUILINO}}",
            para: tenantEmail,
          },
          {
            de: "{{TELEFONO INQUILINO}}",
            para: tenantPhone,
          },

          {
            de: "{{DIA UNO}}",
            para: dayOne,
          },
          {
            de: "{{TOTAL ARRIENDO}}",
            para: total,
          },
        ],
      },
    });
    console.log("Response ", response);
    return {
      error: false,
      response: response.data,
      message: null,
    };
  } catch (error) {
    console.log("error", error);
    return {
      error: true,
      message: {
        title: TITLE_ERROR,
        message: "error",
      },
      response: null,
    };
  }
}
