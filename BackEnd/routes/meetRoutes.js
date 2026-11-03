const express = require("express");
const router = express.Router();
const meetController = require("../Controllers/meetingController");

router.route("/create")
.post(meetController)