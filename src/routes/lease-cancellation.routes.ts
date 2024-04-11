import express from "express";
import {
  getLeaseCancellation,
  cancelLeaseRequest,
} from "../controllers/lease-cancellation.controller";

const router = express.Router();

router.get("/:id", getLeaseCancellation);
router.post("/create", cancelLeaseRequest);

module.exports = router;
