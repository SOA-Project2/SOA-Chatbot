const express = require("express"); //Import express framework module
const morgan = require("morgan"); //Import morgan for middleware to log HTTP requests and errors
const port = process.env.PORT || 80; //Define port: first checks if available in environment variables


const app = express(); //Main express app

app.use(morgan("tiny")); //Log request

const chatbotRoutes = require("./routes/Chatbot");
app.use("/chatbot", chatbotRoutes); //Define path for chatbot requests

app.listen(port, () => console.log(`Service listening on port ${port}...`));
