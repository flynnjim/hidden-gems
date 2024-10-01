const express = require("express");
const cors = require("cors");
const app = express();

app.use(express.json());
app.use(cors());

const { getAllComments } = require("./controllers/get-all-comments.controller");

app.get("/api/comments", getAllComments);

module.exports = app;
