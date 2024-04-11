import { Request } from "express";

export const validateListing = (req: Request) => {
  const {
    address,
    admon,
    amenities,
    amount,
    area,
    bathrooms,
    city,
    deposit,
    duration,
    floors,
    neighborhood,
    parkings,
    rooms,
    state,
    typeProperty,
  } = req.body;

  let error = "Missing: ";

  if (!address) {
    error += "address, ";
  }

  if (!admon) {
    error += "admon, ";
  }

  if (!amenities) {
    error += "amenities, ";
  }

  if (!amount) {
    error += "amount, ";
  }
  if (!area) {
    error += "area, ";
  }

  if (!bathrooms) {
    error += "bathrooms, ";
  }

  if (!city) {
    error += "city, ";
  }

  if (!deposit) {
    error += "deposit, ";
  }

  if (!duration) {
    error += "duration, ";
  }

  if (!floors) {
    error += "floors, ";
  }

  if (!neighborhood) {
    error += "neighborhood, ";
  }

  if (!parkings) {
    error += "parkings, ";
  }

  if (!rooms) {
    error += "rooms, ";
  }

  if (!state) {
    error += "state, ";
  }

  if (!typeProperty) {
    error += "typeProperty, ";
  }

  return {
    err: error.length > 9,
    message: error,
  };
};
