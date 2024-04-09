const statusCodes = require("../constants/statusCodes");
const fs = require('fs');
const path = require('path');

/**
 * Handle AI recommendation request
 * @param {*} req
 * @param {*} res
 * @returns
 */

const postFeedback = async (req, res, next) => {
  try {
    const language = require('@google-cloud/language');
    const client = new language.LanguageServiceClient();
    const feedback = req.body.feedback;

    const emotion = await detectEmotion(feedback, client);
    const message = answerBasedOnEmotion(emotion);
    saveFeedback({ feedback, emotion: emotion.score, message });

    res.status(statusCodes.OK).send({ message });
  } catch (error) {
    return internalError(next);
  }
};


function internalError(next) {

  const err = new Error("Internal server error, an error occured trying to connect with Google Natural Language API");
  err.status = statusCodes.INTERNAL_SERVER_ERROR;
  return next(err);
  
};

async function detectEmotion(feedback, client) {
  const document = {
    content: feedback,
    type: 'PLAIN_TEXT',
    key: process.env.GOOGLE_APPLICATION_CREDENTIALS
  };

  
  const [result] = await client.analyzeSentiment({document: document});
  const emotion = result.documentSentiment;
  console.log(`Texto: ${feedback}`);
  console.log(`Sentimiento: ${emotion.score}`);
  return emotion;
}

function saveFeedback(feedback) {
  const feedbackPath = path.join(__dirname, '../models/feedback.json');
  fs.readFile(feedbackPath, 'utf8', (err, data) => {
    if (err) throw err;
    let json;
    try {
      json = JSON.parse(data);
    } catch (e) {
      json = [];
    }
    json.push(feedback);
    fs.writeFile(feedbackPath, JSON.stringify(json, null, 2), (err) => {
      if (err) throw err;
      console.log('Feedback guardado con éxito.');
    });
  });
}


function answerBasedOnEmotion(emotion) {
  if (emotion.score > 0) {
    return '¡Me alegra ver que estás positivo!';
  } else if (emotion.score < 0) {
    return 'Parece que estás teniendo un mal día, ¿quieres hablar de ello?';
  } else {
    return 'Tu mensaje parece neutral.';
  }
}

module.exports = {
  postFeedback,
};