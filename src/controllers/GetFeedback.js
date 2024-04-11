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
  try {
    const { Storage } = require("@google-cloud/storage");
    const path = require("path");
    
    const keyFilePath = path.join(__dirname, "../soa-g6-p2-b88ea1966460.json");
    
    const storage = new Storage({
      projectId: "soa-g6-p2",
      keyFilename: keyFilePath,
    });

    const bucketName = 'soag6_feedback_bucket';
    const filename = 'feedback.json';

    const file = storage.bucket(bucketName).file(filename);
    
    const [data] = await file.download();
    let feedback;

    try {
      feedback = JSON.parse(data.toString());
    } catch (e) {
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
