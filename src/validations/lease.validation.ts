import { Request } from "express";

export const validateLeaseRequest = (req: Request) => {
  const {
    address,
    amount,
    city,
    duration,
    neighborhood,
    ownerEmail,
    ownerFirstName,
    ownerLastName,
    ownerPhone,
    state,
    tenantDocumentId,
    tenantEmail,
    tenantFirstName,
    tenantLastName,
    tenantPhone,
    tenantTypeDocument,
    typeProperty,
  } = req.body;

  let error = "Missing: ";

  if (!address) {
    error += "address, ";
  }

  if (!amount) {
    error += "amount, ";
  }
  if (!ownerEmail) {
    error += "ownerEmail, ";
  }

  if (!ownerFirstName) {
    error += "ownerFirstName, ";
  }

  if (!city) {
    error += "city, ";
  }

  if (!ownerLastName) {
    error += "ownerLastName, ";
  }

  if (!duration) {
    error += "duration, ";
  }

  if (!ownerPhone) {
    error += "ownerPhone, ";
  }

  if (!neighborhood) {
    error += "neighborhood, ";
  }

  if (!tenantDocumentId) {
    error += "tenantDocumentId, ";
  }

  if (!tenantTypeDocument) {
    error += "tenantTypeDocument, ";
  }

  if (!tenantEmail) {
    error += "tenantEmail, ";
  }

  if (!state) {
    error += "state, ";
  }

  if (!typeProperty) {
    error += "typeProperty, ";
  }

  if (!tenantFirstName) {
    error += "tenantFirstName, ";
  }

  if (!tenantLastName) {
    error += "tenantLastName, ";
  }

  if (!tenantPhone) {
    error += "tenantPhone, ";
  }

  return {
    err: error.length > 9,
    message: error,
  };
};
