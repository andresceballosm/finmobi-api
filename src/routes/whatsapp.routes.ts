import express from "express";
import { postMessage } from "../controllers/whatsapp.controller";

const router = express.Router();

router.post("/", postMessage);

module.exports = router;
