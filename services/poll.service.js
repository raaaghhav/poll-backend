const Poll = require("./../models/poll");

const pollService = {
  create: async (question, expiresAt) => {
    try {
      const result = await Poll.create({ question, expiresAt });

      return result || false;
    } catch (error) {
      console.log(error);
    }
  },
  getById: async (pollId) => {
    try {
      const poll = await Poll.findById(pollId);
      return poll || null;
    } catch (error) {
      console.error("Get Poll Error:", error);
      throw error;
    }
  },

  getAll: async () => {
    try {
      return await Poll.find({});
    } catch (error) {
      console.error("Get All Polls Error:", error);
      throw error;
    }
  },

  //   submitResponse: async (pollId, userId, responseType) => {
  //     try {
  //       const response = await Response.create({ pollId, userId, responseType });
  //       return response;
  //     } catch (error) {
  //       console.error("Submit Response Error:", error);
  //       throw error;
  //     }
  //   },

  submitResponse: async (poll, ip, type) => {
    try {
      if (type === "like") poll.likes++;
      else poll.dislikes++;

      poll.responders.push(ip);
      await poll.save();

      return poll;
    } catch (error) {
      console.error("Poll Save Error:", error);
      throw error;
    }
  },

  hasUserResponded: async (pollId, userId) => {
    try {
      const existing = await Response.findOne({ pollId, userId });
      return !!existing;
    } catch (error) {
      console.error("Check Duplicate Response Error:", error);
      throw error;
    }
  },

  getResults: async (pollId) => {
    try {
      const likeCount = await Response.countDocuments({
        pollId,
        responseType: "like",
      });
      const dislikeCount = await Response.countDocuments({
        pollId,
        responseType: "dislike",
      });

      return { like: likeCount, dislike: dislikeCount };
    } catch (error) {
      console.error("Get Results Error:", error);
      throw error;
    }
  },

  getAllPolls: async (search = "", limit = 10, offset = 0) => {
    try {
      const query = search
        ? { question: { $regex: search, $options: "i" } }
        : {};

      const polls = await Poll.find(query)
        .skip(offset)
        .limit(limit)
        .sort({ createdAt: -1 });

      const total = await Poll.countDocuments(query);
      return { polls, total };
    } catch (err) {
      console.error("Get All Polls Error:", err);
      throw err;
    }
  },
};

module.exports = pollService;
