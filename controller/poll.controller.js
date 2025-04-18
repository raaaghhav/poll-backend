const pollService = require("../services/poll.service");
const {
  createPollSchema,
  submitResponseSchema,
} = require("./../validations/poll.validation");
const { RESPONSE_MESSAGES, STATUS_CODES } = require("./../constants/en");
const mongoose = require("mongoose");

const controller = {
  createPoll: async (req, res) => {
    let response = {};
    try {
      const { question, durationInMinutes } = req.body;
      const { error } = createPollSchema.validate(req.body);

      if (error) {
        return res.status(400).json({ message: error.details[0].message });
      }
      const expiresAt = new Date(Date.now() + durationInMinutes * 60000);

      let result = await pollService.create(question, expiresAt);

      if (result) {
        response.result = result;
        response.status = STATUS_CODES.CREATED;
        response.message = RESPONSE_MESSAGES.POLL_CREATED;
        return res.json(response);
      }
    } catch (error) {
      console.log(error);
      res.status = STATUS_CODES.SERVER_ERROR;
      response.errorMessage = RESPONSE_MESSAGES.SERVER_ERROR;
    }
  },

  submitResponse: async (req, res) => {
    try {
      const { id } = req.params;
      const { type, ip } = req.body;

      const { error } = submitResponseSchema.validate({ type, ip });
      if (error) {
        return res
          .status(STATUS_CODES.BAD_REQUEST)
          .json({ message: error.details[0].message });
      }

      const poll = await pollService.getById(id);
      if (!poll) {
        return res
          .status(STATUS_CODES.NOT_FOUND)
          .json({ message: RESPONSE_MESSAGES.POLL_NOT_FOUND });
      }

      if (poll.expiresAt < new Date()) {
        return res
          .status(STATUS_CODES.BAD_REQUEST)
          .json({ message: RESPONSE_MESSAGES.POLL_EXPIRED });
      }

      const existingResponse = poll.responders.find((r) => r.ip === ip);

      if (existingResponse) {
        /** If same type submitted again → block */
        if (existingResponse.type === type) {
          return res
            .status(STATUS_CODES.FORBIDDEN)
            .json({ message: RESPONSE_MESSAGES.DUPLICATE_RESPONSE });
        }

        if (existingResponse.type === "like") {
          poll.likes = Math.max(0, poll.likes - 1);
        } else {
          poll.dislikes = Math.max(0, poll.dislikes - 1);
        }

        if (type === "like") {
          poll.likes += 1;
        } else {
          poll.dislikes += 1;
        }
        existingResponse.type = type;
      } else {
        if (type === "like") poll.likes++;
        else poll.dislikes++;

        poll.responders.push({ ip, type });
      }

      await poll.save();

      res.status(STATUS_CODES.OK).json(poll);
    } catch (err) {
      console.error("Submit Response Controller Error:", err);
      res
        .status(STATUS_CODES.SERVER_ERROR)
        .json({ message: RESPONSE_MESSAGES.SERVER_ERROR });
    }
  },

  getPoll: async (req, res) => {
    try {
      const { id } = req.params;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res
          .status(STATUS_CODES.BAD_REQUEST)
          .json({ message: "Invalid Poll ID" });
      }

      const poll = await pollService.getById(id);
      if (!poll) {
        return res
          .status(STATUS_CODES.NOT_FOUND)
          .json({ message: RESPONSE_MESSAGES.POLL_NOT_FOUND });
      }

      res.status(STATUS_CODES.OK).json(poll);
    } catch (err) {
      console.error("Get Poll Error:", err);
      res
        .status(STATUS_CODES.SERVER_ERROR)
        .json({ message: RESPONSE_MESSAGES.SERVER_ERROR });
    }
  },

  getAllPolls: async (req, res) => {
    try {
      const { search = "", limit = 10, offset = 0 } = req.query;

      const parsedLimit = parseInt(limit);
      const parsedOffset = parseInt(offset);

      const result = await pollService.getAllPolls(
        search,
        parsedLimit,
        parsedOffset
      );

      res.status(STATUS_CODES.OK).json({
        message: "Polls fetched successfully.",
        count: result.total,
        data: result.polls,
      });
    } catch (err) {
      console.error("Get All Polls Controller Error:", err);
      res
        .status(STATUS_CODES.SERVER_ERROR)
        .json({ message: RESPONSE_MESSAGES.SERVER_ERROR });
    }
  },
};

module.exports = controller;
