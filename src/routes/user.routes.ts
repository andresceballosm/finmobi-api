import express from "express";
import { check } from "express-validator";
import { get, getMe, updateMe } from "../controllers/user.controller";
import { existUserByID } from "../helpers/db-validator.helper";
import { validateJWT } from "../middlewares/validate-jwt.middlewares";

const router = express.Router();

router.get(
  "/",
  [
    validateJWT,
    check("id", "Not is a valid ID").isMongoId(),
    check("id").custom(existUserByID),
  ],
  getMe,
);

router.post(
  "/me/update",
  [
    validateJWT,
    check("id", "Not is a valid ID").isMongoId(),
    check("id").custom(existUserByID),
  ],
  updateMe,
);

router.get(
  "/:id",
  [
    validateJWT,
    check("id", "Not is a valid ID").isMongoId(),
    check("id").custom(existUserByID),
  ],
  get,
);

module.exports = router;
