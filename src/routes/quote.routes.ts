import express from "express";
//import controllers
import { createQuote, updateQuote } from "../controllers/quote.controller";

const router = express.Router();

router.post("/create", createQuote);
router.post("/update", updateQuote);

module.exports = router;
