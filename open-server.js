const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));

const API_KEY = process.env.API_KEY;
const API_URL = "https://api.openai.com/v1/completions";

// Define the route to handle chat interactions
app.post("/chat", async (req, res) => {
  console.log(req.body);
  try {
    const response = await axios.post(
      API_URL,
      {
        model: "text-davinci-003",
        prompt: req.body.userText,
        max_tokens: 2048,
        temperature: 0.2,
        n: 1,
        stop: null,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_KEY}`,
        },
      }
    );

    const chatResponse = response.data.choices[0].text;
    const lines = chatResponse.split("\n\n");
    lines.forEach((element) => {
      const str = element.split("\n");
      element = str.join("");
    });

    // const filteredLines = lines.filter((line) => !/^\d+\.\s+/.test(line));
    const modifiedText = lines.join(" ");
    res.json({ modifiedText });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      error:
        "Oops! Something went wrong while retrieving the response. Please try again.",
    });
  }
});

// Add other routes and configurations as needed

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
