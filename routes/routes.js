const express = require("express");
const router = express.Router();
const controller = require("./../controller/poll.controller");

router.post("/create", controller.createPoll);
router.post("/:id/respond", controller.submitResponse);
router.get("/:id", controller.getPoll);

module.exports = router;
