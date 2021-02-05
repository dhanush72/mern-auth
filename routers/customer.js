const express = require("express");
const router = express.Router();

const { authCheck } = require("../middleware/authCheck");
const { customer, customers } = require("../controllers/customer");

router.post("/customer", authCheck, customer);
router.get("/customers", authCheck, customers);

module.exports = router;
