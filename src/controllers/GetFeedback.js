const statusCodes = require("../constants/statusCodes");
const fs = require('fs');
const path = require('path');

/**
 * Handle AI recommendation request
 * @param {*} req
 * @param {*} res
 * @returns
 */

const getFeedback = async (req, res, next) => {
  const feedbackPath = path.join(__dirname, '../models/feedback.json');
  try {
    const data = await fs.promises.readFile(feedbackPath, 'utf8');
    let feedback;
    if (data) {
      feedback = JSON.parse(data);
    } else {
      feedback = [];
    }
    res.status(statusCodes.OK).json(feedback);
  } catch (error) {
    return internalError(next);
  }
};


function internalError(next) {

  const error = new Error("Internal server error, an error occured trying to retrieve feedbacks from the database");
  error.status = statusCodes.INTERNAL_SERVER_ERROR;
  return next(error);
  
};


module.exports = {
  getFeedback,
};
