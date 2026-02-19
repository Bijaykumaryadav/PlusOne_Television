// Function to send a response
module.exports.sendResponse = (
  res,
  status,
  success,
  message,
  data = {},
  error = {}
) => {
  res.status(status).json({ success, message, ...data, ...error });
};