const statusCodes = require("../constants/statusCodes");
const fs = require('fs');
const path = require('path');
const language = require('@google-cloud/language');

/**
 * Handle AI recommendation request
 * @param {*} req
 * @param {*} res
 * @returns
 */

const postFeedback = async (req, res, next) => {
  try {
    const client = new language.LanguageServiceClient();
    const feedback = req.body.feedback;

    const sentimiento = await detectEmotion(feedback);
    const respuesta = answerBasedOnEmotion(sentimiento);
    console.log(respuesta);

    saveFeedback({ feedback, sentimiento: sentimiento.score, respuesta });

    res.status(statusCodes.OK).send({ respuesta });
  } catch (error) {
    return internalError(next);
  }
};


function internalError(next) {

  const err = new Error("Internal server error, an error occured trying to connect with Google Natural Language API");
  err.status = statusCodes.INTERNAL_SERVER_ERROR;
  return next(err);
  
};

function saveFeedback(feedback) {
  const feedbackPath = path.join(__dirname, '../models/feedback.json');
  fs.readFile(feedbackPath, (err, data) => {
    if (err) throw err;
    let json = JSON.parse(data);
    json.push(feedback);
    fs.writeFile(feedbackPath, JSON.stringify(json, null, 2), (err) => {
      if (err) throw err;
      console.log('Feedback guardado con éxito.');
    });
  });
}



async function detectEmotion(feedback) {
  const document = {
    content: feedback,
    type: 'PLAIN_TEXT',
  };

  
  const [result] = await client.analyzeSentiment({document: document});
  const sentimiento = result.documentSentiment;
  console.log(`Texto: ${texto}`);
  console.log(`Sentimiento: ${sentimiento.score}`);
  return sentimiento;
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