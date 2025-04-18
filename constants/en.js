// constants/index.js

module.exports = {
  RESPONSE_MESSAGES: {
    POLL_CREATED: "Poll created successfully.",
    POLL_NOT_FOUND: "Poll not found.",
    RESPONSE_RECORDED: "Response recorded successfully.",
    DUPLICATE_RESPONSE: "You have already responded to this poll.",
    POLL_EXPIRED: "This poll has expired.",
    SERVER_ERROR: "Something went wrong. Please try again later.",
    INVALID_INPUT: "Invalid input data.",
  },

  SOCKET_EVENTS: {
    CONNECT: "connect",
    DISCONNECT: "disconnect",
    NEW_RESPONSE: "new-response",
    UPDATE_RESULTS: "update-results",
    JOIN_POLL_ROOM: "join-poll-room",
  },

  POLL_STATUS: {
    ACTIVE: "active",
    EXPIRED: "expired",
  },

  STATUS_CODES: {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    SERVER_ERROR: 500,
  },

  TIME: {
    ONE_MINUTE: 60 * 1000,
    ONE_HOUR: 60 * 60 * 1000,
  },

  HEADERS: {
    CONTENT_TYPE_JSON: { "Content-Type": "application/json" },
  },
};
