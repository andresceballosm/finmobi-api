import express from "express";
import {
  accounts,
  analyzeLease,
  balances,
  incomes,
  recurringExpenses,
  transactions,
} from "../controllers/belvo.controller";

const router = express.Router();

router.post("/accounts", accounts);
router.post("/balances", balances);
router.post("/incomes", incomes);
router.post("/transactions", transactions);
router.post("/expenses", recurringExpenses);
router.post("/lease/analyze", analyzeLease);

module.exports = router;
