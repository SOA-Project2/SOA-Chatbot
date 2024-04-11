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
  
    if (!req.body || !req.body.feedback) {
      return emptyBodyError(next);
    }

    const feedback = req.body.feedback;
    const emotion = await detectEmotion(feedback, client);
    const message = answerBasedOnEmotion(emotion);
    saveFeedback({ feedback, emotion: emotion.score, message }, next);
  
    res.status(statusCodes.OK).send({ message });
  } catch (error) {
    return internalError(next);
  };
};


function internalError(next) {

  const err = new Error("Internal server error, an error occured trying to connect with Google Natural Language API");
  err.status = statusCodes.INTERNAL_SERVER_ERROR;
  return next(err);
  
};

function emptyBodyError(next) {

  const err = new Error("Bad request, feedback was not provided in the request body");
  err.status = statusCodes.BAD_REQUEST;
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

async function saveFeedback(feedback, next) {
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
    let json;
    try {
      json = JSON.parse(data.toString());
    } catch (e) {
      json = [];
    }
    
    json.push(feedback);
    
    const jsonContent = JSON.stringify(json, null, 2);
    
    await file.save(jsonContent);
    
    console.log('Feedback saved successfully.');
  } catch (err) {
    return internalStorageError(next);
  }
}

function internalStorageError(next) {

  const err = new Error("Internal server error, an error occured trying to connect with Google Cloud Storage API");
  err.status = statusCodes.INTERNAL_SERVER_ERROR;
  return next(err);
  
};


function answerBasedOnEmotion(emotion) {
  if (emotion.score > 0.75) {
    return '¡Estamos encantados de que hayas disfrutado tu experiencia con nosotros!';
  } else if (emotion.score > 0.5) {
    return '¡Gracias por tu visita! Nos alegra saber que estás satisfecho.';
  } else if (emotion.score > 0.25) {
    return 'Nos complace que hayas tenido una experiencia positiva.';
  } else if (emotion.score > 0) {
    return '¡Gracias por visitarnos y por dejarnos tus comentarios!';
  } else if (emotion.score === 0) {
    return 'Agradecemos tus comentarios, siempre estamos buscando mejorar.';
  } else if (emotion.score < -0.75) {
    return 'Lamentamos mucho que tu experiencia no haya sido satisfactoria. Agradecemos tus comentarios para mejorar?';
  } else if (emotion.score < -0.5) {
    return 'Parece que algo no estuvo a la altura de tus expectativas. Agradecemos tus comentarios para mejorar.';
  } else if (emotion.score < -0.25) {
    return 'Sentimos que no estés completamente satisfecho. Valoramos tus comentarios.';
  } else if (emotion.score < 0) {
    return 'Esta situación es inaceptable. Haremos lo posible para que no se repita.';
  } else {
    return 'Parece que hemos tenido un error. Por favor, cuéntanos más para entender mejor.';
  }
}


module.exports = {
  postFeedback,
};