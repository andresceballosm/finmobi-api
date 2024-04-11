import express from "express";
//import controllers
import {
  register,
  login,
  forgotPassword,
  resetPassword,
  generateBelvoToken,
} from "../controllers/auth.controller";
const router = express.Router();

//routes
router.route("/register").post(register);
router.route("/belvo/token").get(generateBelvoToken);
router.route("/login").post(login);
router.route("/forgotpassword").post(forgotPassword);
router.route("/resetpassword/:resetToken").post(resetPassword);

module.exports = router;
