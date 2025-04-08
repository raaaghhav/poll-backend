const Poll = require("./../models/poll");

const controller = {
  createPoll: async (req, res) => {
    const { question, durationInMinutes } = req.body;
    const expiresAt = new Date(Date.now() + durationInMinutes * 60000);
    const poll = await Poll.create({ question, expiresAt });
    res.json(poll);
  },

  submitResponse: async (req, res) => {
    const { id } = req.params;
    const { type, ip } = req.body;

    const poll = await Poll.findById(id);
    if (!poll || poll.expiresAt < new Date())
      return res.status(400).send("Poll expired");

    if (poll.responders.includes(ip))
      return res.status(403).json("Duplicate response");

    if (type === "like") poll.likes++;
    else poll.dislikes++;

    poll.responders.push(ip);
    await poll.save();

    const io = req.app.get("io");
    io.emit(`poll-update-${id}`, poll); // emit updated data

    res.json(poll);
  },

  getPoll: async (req, res) => {
    const poll = await Poll.findById(req.params.id);
    res.json(poll);
  },
};

module.exports = controller;
