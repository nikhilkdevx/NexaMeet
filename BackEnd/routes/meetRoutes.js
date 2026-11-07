const express = require("express");
const router = express.Router();
const meetController = require("../Controllers/meetingController");
const authMiddleWare = require("../middleware/authMiddleware");

router.route("/create")
.post(authMiddleWare,meetController.create);

module.exports = router;