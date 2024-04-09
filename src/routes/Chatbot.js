const express = require("express");
const router = express.Router();


const errorHandler = require("../errors/RecommendationError");
router.use(errorHandler.queryValidatorMiddleware);

//import controllers
const { getFeedback } = require("../controllers/GetFeedback");
const { postFeedback } = require("../controllers/PostFeedback");


//assign controller for every route
router.get("/getFeedback", getFeedback);
router.get("/postFeedback", postFeedback);

module.exports = router;
