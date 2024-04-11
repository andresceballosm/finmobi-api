import { Request } from "express";

export const validateQuote = (req: Request) => {
  const { amount, city, duration, state, tenantEmail } = req.body;

  let error = "Missing: ";

  if (!amount) {
    error += "amount, ";
  }

  if (!city) {
    error += "city, ";
  }

  if (!duration) {
    error += "duration, ";
  }

  if (!tenantEmail) {
    error += "tenantEmail, ";
  }

  if (!state) {
    error += "state, ";
  }
  console.log("error ", error.length);
  return {
    err: error.length > 9,
    message: error,
  };
};
