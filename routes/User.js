const express = require("express");
const { getUserDetails } = require("../controllers/User");
const { verifyJWT } = require("../middleware/verifyJWT");
const router = express.Router();

router.get("/getUserDetails/:userId",  getUserDetails);
// router.get("/getUserDetails", verifyJWT, getUserDetails);

module.exports = router;
