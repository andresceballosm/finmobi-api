import express from "express";
import { check } from "express-validator";
//import controllers
import { create } from "../controllers/listing.controller";
import { validateJWT } from "../middlewares/validate-jwt.middlewares";
const router = express.Router();

router.post(
  "/listing/create",
  [validateJWT, check("id", "Not is a valid ID").isMongoId()],
  create,
);
