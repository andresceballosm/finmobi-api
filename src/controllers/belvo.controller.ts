import { Logger } from "@overnightjs/logger";
import axios from "axios";
import { Response } from "express";
import moment from "moment";
import { TITLE_ERROR } from "../constants/messages.constants";
import { LeaseRequest } from "../models/lease-request.model";
import { sendSmsWhatsAppService } from "../services/twilio-whatsapp.service";
import { getLastThreeMonths } from "../utils/date.utils";

const belvo = require("belvo").default;

export async function accounts(req: any, res: Response) {
  try {
    if (!req.body.link) {
      return res.status(400).send({
        ok: false,
        response: {
          msg: "Falta link",
          code: "app-missing-fields",
        },
      });
    }
    const client = new belvo(
      process.env.BELVO_SECRET_ID,
      process.env.BELVO_SECRET_PASSWORD,
      process.env.BELVO_ENV,
    );

    client.connect().then(function() {
      client.accounts
        .retrieve(req.body.link)
        .then(function(response: any) {
          res.status(200).send({
            error: false,
            accounts: response,
          });
        })
        .catch(function(error: any) {
          return res.send({
            error: true,
            message: {
              title: "Error",
              message: error,
            },
            res,
          });
        });
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

export async function balances(req: any, res: Response) {
  try {
    const { from, to, link } = req.body;
    if (!from || !to || !link) {
      return res.status(400).send({
        ok: false,
        response: {
          msg: "Falta informacion",
          code: "app-missing-fields",
        },
      });
    }

    const fromFormat = moment(new Date(from)).format("YYYY-MM-DD");
    const toFormat = moment(new Date(to)).format("YYYY-MM-DD");

    const client = new belvo(
      process.env.BELVO_SECRET_ID,
      process.env.BELVO_SECRET_PASSWORD,
      process.env.BELVO_ENV,
    );

    client.connect().then(function() {
      client.balances
        .retrieve(req.body.link, fromFormat, { dateTo: toFormat })
        .then(function(response: any) {
          console.log("response in balances ", response);
          res.status(200).send({
            error: false,
            balances: response,
          });
        })
        .catch(function(error: any) {
          console.log("error ", error);
          res.send({
            error: true,
            message: {
              title: "Error",
              message: error,
            },
            res,
          });
        });
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

export async function incomes(req: any, res: Response) {
  try {
    const { link, from, to } = req.body;
    if (!from || !to || !link) {
      return res.status(400).send({
        ok: false,
        response: {
          msg: "Falta informacion",
          code: "app-missing-fields",
        },
      });
    }

    const fromFormat = moment(new Date(from)).format("YYYY-MM-DD");
    const toFormat = moment(new Date(to)).format("YYYY-MM-DD");

    const client = new belvo(
      process.env.BELVO_SECRET_ID,
      process.env.BELVO_SECRET_PASSWORD,
      process.env.BELVO_ENV,
    );

    client.connect().then(function() {
      client.incomes
        .retrieve(req.body.link)
        .then(function(response: any) {
          console.log("response ", response);
          res.status(200).send({
            error: false,
            incomes: response,
          });
        })
        .catch(function(error: any) {
          return res.send({
            error: true,
            message: {
              title: "Error",
              message: error,
            },
            res,
          });
        });
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

export async function transactions(req: any, res: Response) {
  try {
    const { from, to, link } = req.body;
    if (!from || !to || !link) {
      return res.status(400).send({
        ok: false,
        response: {
          msg: "Falta informacion",
          code: "app-missing-fields",
        },
      });
    }

    const fromFormat = moment(new Date(from)).format("YYYY-MM-DD");
    const toFormat = moment(new Date(to)).format("YYYY-MM-DD");

    const months = getLastThreeMonths(new Date());
    console.log("months?? ", months);

    const client = new belvo(
      process.env.BELVO_SECRET_ID,
      process.env.BELVO_SECRET_PASSWORD,
      process.env.BELVO_ENV,
    );

    client.connect().then(function() {
      client.transactions
        .retrieve(req.body.link, fromFormat, { dateTo: toFormat })
        .then(function(response: any) {
          res.status(200).send({
            error: false,
            transactions: response,
          });
        })
        .catch(function(error: any) {
          console.log("error ", error);
          res.send({
            error: true,
            message: {
              title: "Error",
              message: error,
            },
            res,
          });
        });
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

export async function recurringExpenses(req: any, res: Response) {
  try {
    if (!req.body.link) {
      return res.status(400).send({
        ok: false,
        response: {
          msg: "Falta link",
          code: "app-missing-fields",
        },
      });
    }
    const client = new belvo(
      process.env.BELVO_SECRET_ID,
      process.env.BELVO_SECRET_PASSWORD,
      process.env.BELVO_ENV,
    );

    client.connect().then(function() {
      client.recurringExpense
        .retrieve(req.body.link)
        .then(function(response: any) {
          console.log("response in recurring expenses ", response);
          res.status(200).send({
            error: false,
            recurringExpenses: response,
          });
        })
        .catch(function(error: any) {
          return res.send({
            error: true,
            message: {
              title: "Error",
              message: error,
            },
            res,
          });
        });
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

export async function analyzeLease(req: any, res: Response) {
  try {
    const { id } = req.body;
    if (!id) {
      return res.status(400).send({
        ok: false,
        response: {
          msg: "Faltan parametros",
          code: "app-missing-fields",
        },
      });
    }

    const months = getLastThreeMonths(new Date());
    const toFormat = `${months[0].year}-${months[0].month}-${months[0].days}`;
    const fromFormat = `${months[2].year}-${months[2].month}-${months[2].days}`;
    const leaseRequest = await LeaseRequest.findById(id);
    const lease = leaseRequest.transform();

    // if (lease?.links.length === 0) {
    //   return res.json({
    //     error: true,
    //     accepted: false,
    //     response:
    //       "Lo sentimos, no es posible proceder en este momento con el analisis, debe primero conectar una cuenta bancaria.",
    //   });
    // }

    // if (lease?.status !== "in-process") {
    //   return res.json({
    //     error: true,
    //     accepted: false,
    //     response:
    //       "Lo sentimos, esta solicitud ya no esta vigente, por favor inicie una nueva solicitud.",
    //   });
    // }

    // const client = new belvo(
    //   process.env.BELVO_SECRET_ID,
    //   process.env.BELVO_SECRET_PASSWORD,
    //   process.env.BELVO_ENV,
    // );

    // await client.connect();
    // const accounts = lease.links || [];
    // console.log("accounts ", accounts);
    // let averageIncome = 0;
    // let averageExpense = 0;
    // let transactions: any[] = [];
    // const total = lease.amount + lease.admon + lease.fee;

    // for (const account of accounts) {
    //   //=================== VERIFY OWNER =====================================================
    //   const responseOwner = await getOwnerService(client, account.link);
    //   if (responseOwner.error) {
    //     return res.json(responseOwner);
    //   }
    //   console.log("responseOwner ", responseOwner.owner[0]);
    //   console.log(
    //     "document_id ",
    //     responseOwner.owner[0].document_id.document_number,
    //   );
    //   const documentNumer = responseOwner.owner[0].document_id.document_number;

    //   // if (lease.tenantDocumentId !== documentNumer) {
    //   //   continue;
    //   // }
    //   //=================== INCOMES ==========================================================
    //   const responseIncomes = await getIncomesService(client, account.link);

    //   if (responseIncomes.error) {
    //     return res.json(responseIncomes);
    //   }

    //   console.log("incomes ", responseIncomes.incomes);
    //   responseIncomes.incomes.map((income: any) => {
    //     income.sources.map((item: any) => {
    //       averageIncome += getIncomeMonthly(
    //         item.average_transaction_amount || 0,
    //         item.frequency || "",
    //       );
    //     });
    //     return income;
    //   });

    //   //========================== EXPENSES =====================================================
    //   const responseExpenses = await getExpensesService(client, account.link);

    //   if (responseExpenses.error) {
    //     return res.json(responseExpenses);
    //   }
    //   responseExpenses.expenses.map((expense: any) => {
    //     averageExpense += getIncomeMonthly(
    //       expense.average_transaction_amount || 0,
    //       expense.frequency || "",
    //     );
    //     return expense;
    //   });

    //   // ======================= GET TRANSACTIOS =================================
    //   const response = await getTransactionsService(
    //     client,
    //     lease.links[0].link,
    //     fromFormat,
    //     toFormat,
    //   );

    //   if (response.error) {
    //     res.json(response);
    //   }

    //   transactions.concat(response.transactions);
    // }
    // // ========================= VALIDATE INCOMES ================================
    // console.log("averageIncome ", averageIncome);
    // if (averageIncome <= total) {
    //   return res.json({
    //     error: true,
    //     accepted: false,
    //     response:
    //       "Lo sentimos en el momento no podemos verificar que sus ingresos sean suficientes para cubrir el canon de arrendamiento, intente con otra cuenta donde podamos verificar mas ingresos.",
    //   });
    // }

    // // ========================= VALIDATE EXPENSES VS INCOMES ================================
    // console.log("averageExpense ", averageExpense);
    // const incomeAvailable = averageIncome - averageExpense;
    // const availableForLease = incomeAvailable * 0.4;

    // if (availableForLease < total) {
    //   return res.json({
    //     error: true,
    //     accepted: false,
    //     response:
    //       "Lo sentimos en el momento no podemos verificar que sus ingresos - deudas sean suficientes para cubrir el canon de arrendamiento, intente con otra cuenta donde podamos verificar mas ingresos.",
    //   });
    // }

    // for (const transaction of transactions) {
    //   const month = new Date(transaction.value_date).getMonth() + 1;
    //   if (transaction.type === "INFLOW") {
    //     if (month === months[0].month) {
    //       months[0].inflow += transaction.amount;
    //     }

    //     if (month === months[1].month) {
    //       months[1].inflow += transaction.amount;
    //     }

    //     if (month === months[2].month) {
    //       months[2].inflow += transaction.amount;
    //     }
    //   } else {
    //     if (
    //       transaction.account.category === "LOAN_ACCOUNT" ||
    //       transaction.account.category === "Credits & Loans"
    //     ) {
    //       if (
    //         transaction.account.loan_data.limit_date < transaction.value_date
    //       ) {
    //         return res.json({
    //           error: false,
    //           accepted: false,
    //           response:
    //             "Lo sentimos en el momento su solicitud no es viable, debes mejorar tu comportamiento de pago.",
    //         });
    //       }
    //     }
    //     if (month === months[0].month) {
    //       months[0].outflow += transaction.amount;
    //     }

    //     if (month === months[1].month) {
    //       months[1].outflow += transaction.amount;
    //     }

    //     if (month === months[2].month) {
    //       months[2].outflow += transaction.amount;
    //     }
    //   }
    // }

    // const isNonViable = months.find((month: any) => {
    //   const { inflow, outflow } = month;
    //   if (inflow < total) {
    //     return true;
    //   }
    //   if ((inflow - outflow) * 0.4 < total) {
    //     return true;
    //   }
    //   return false;
    // });

    // if (isNonViable) {
    //   return res.json({
    //     error: false,
    //     accepted: false,
    //     response:
    //       "Lo sentimos en el momento no podemos verificar que sus ingresos - egresos sean suficientes para cubrir el canon de arrendamiento, intente con otra cuenta donde podamos verificar mas ingresos.",
    //   });
    // }

    const leaseRequestUpdate = await LeaseRequest.findByIdAndUpdate(
      lease.id,
      { status: "pre-approved" },
      {
        upsert: true,
      },
    );
    const tenenName = (lease.tenantFirstName = " " + lease.tenantLastName);
    const messageOwner = `Buen día👋  ${lease.ownerFirstName}, somos Finmobi🚀 una Fintech que ayuda a propietarios a rentar más rápido, ya que no se necesita de codeudores. Si su inquilino se atrasa, nosotros respondemos para que usted tenga el pago oportuno 🕛 en su cuenta bancaria cada mes 📅.

    En esta ocasión, ${tenenName} solicitó nuestro servicio para arrendar su inmueble 🏠 ubicado en la ciudad de ${lease.city} en la dirección ${lease.address}. ¿Está de acuerdo en continuar con el proceso?
    
    ✅ Si desea continuar abre el siguiente link: https://finmobi.co/lease-request/${lease?.id}/owner
    
    ❓ Si necesita más información acerca de Finmobi abre el siguiente link: https://finmobi.co
    
    ❌ Si desea cancelar la solicitud abre el siguiente link: https://finmobi.co/lease-request/${lease?.id}/cancellation`;
    // const messageToOwner = `Buen día👋 ${lease.ownerFirstName}, somos Finmobi🚀 una Fintech que ayuda a propietarios a rentar más rápido, ya que no se necesita de codeudores. Si su inquilino se atrasa, nosotros respondemos para que usted tenga el pago oportuno 🕛 en su cuenta bancaria cada mes 📅.`;
    const pricing = `por un valor mensual de $${lease.amount} + $${lease.admon} administración`;
    const messageToOwner2 = `En esta ocasión, ${lease.tenantFirstName} ${lease.tenantLastName} solicitó nuestro servicio para arrendar su inmueble 🏠 ubicado en la ciudad de ${lease.city} en la dirección ${lease.address}. ¿Está de acuerdo en continuar con el proceso?`;
    const messageToOwner3 = `✅ Si desea continuar abre el siguiente link: https://finmobi.co/lease-request/${lease?.id}/owner`;
    const messageToOwner4 = `❓ Si necesita más información acerca de Finmobi abre el siguiente link: https://finmobi.co`;
    const messageToOwner5 = `❌ Si desea cancelar la solicitud abre el siguiente link: https://finmobi.co/lease-request/${lease?.id}/cancellation`;
    const from = "+15073387751";
    const to = lease.ownerPhone;

    const firstSmsRequest = await sendSmsWhatsAppService(
      to,
      from,
      messageOwner,
      true,
    );
    console.log("firstSmsRequest ", firstSmsRequest);

    if (!firstSmsRequest.error) {
      return res.json({
        error: false,
        accepted: true,
        response:
          "Felicidades su solicitud ha sido pre-aprobada!, nos pondremos en contacto via WhatsApp con el propietario del inmueble y usted, para la firma de contrato.",
      });
    }
    return res.json({
      error: true,
      accepted: false,
      response: "Lo sentimos algo ocurrio, intentelo de nuevo más tarde",
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
