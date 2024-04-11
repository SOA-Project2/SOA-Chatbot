const express = require("express"); 
const morgan = require("morgan");
const bodyParser = require('body-parser');

const port = 5555;

const app = express(); 

app.use(morgan("tiny"));
app.use(bodyParser.urlencoded({ extended: true })); 

const { getFeedback } = require("./controllers/GetFeedback");
const { postFeedback } = require("./controllers/PostFeedback");


//assign controller for every route
app.get("/getFeedback", getFeedback);
app.post("/postFeedback", postFeedback);

app.listen(port, () => console.log(`Service listening on port ${port}...`));

module.exports = {
    app
};