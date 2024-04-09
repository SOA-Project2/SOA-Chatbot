const statusCodes = require("../constants/statusCodes");

/**
 * Handle AI recommendation request
 * @param {*} req
 * @param {*} res
 * @returns
 */
const getFeedback = async (req, res, next) => {
  
};

function internalError(next) {

  const err = new Error("Internal server error, an error occured trying to connect with Google Natural Language API");
  err.status = statusCodes.INTERNAL_SERVER_ERROR;
  return next(err);
  
};


module.exports = {
  getFeedback,
};
