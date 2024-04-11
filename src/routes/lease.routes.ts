import express from "express";
import { check } from "express-validator";
import {
  createLeaseContract,
  getLeaseContract,
  validateSignedContract,
} from "../controllers/lease-contract.controller";
//import controllers
import {
  accountsByLease,
  addLinkToLease,
  cancelLeaseRequest,
  createLeaseRequest,
  getLeaseRequest,
  removeLinkLeaseRequest,
} from "../controllers/lease.controller";

const router = express.Router();

router.get("/request/:id", getLeaseRequest);
router.get("/request/cancel/:id", cancelLeaseRequest);
router.get("/request/accounts/:id", accountsByLease);
router.post("/request/create", createLeaseRequest);
router.post("/request/links/delete", removeLinkLeaseRequest);
router.post("/request/add-link", addLinkToLease);
router.get("/contract/:id", getLeaseContract);
router.post("/contract/create", createLeaseContract);
router.post("/contract/zapsign", validateSignedContract);

module.exports = router;
