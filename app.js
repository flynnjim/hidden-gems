const express = require("express");
const cors = require("cors");
const app = express();

app.use(express.json());
app.use(cors());

const { getAllComments } = require("./controllers/get-all-comments.controller");
const { getGemComments } = require('./controllers/get-gem-comments.controller')

app.get("/api/comments", getAllComments);

app.get('/api/comments/:gem_id', getGemComments)

module.exports = app;
