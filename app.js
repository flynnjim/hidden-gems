const express = require("express");
const cors = require("cors");
const app = express();

app.use(express.json());
app.use(cors());

const { getAllComments } = require("./controllers/get-all-comments.controller");
const { getGemComments } = require("./controllers/get-gem-comments.controller");
const { postComment } = require("./controllers/post-new-comment.controller");
const { deleteComment } = require('./controllers/delete-comment.controller')

app.get("/api/comments", getAllComments);

app.get("/api/comments/:gem_id", getGemComments);

app.post("/api/comments", postComment);

app.delete("/api/comments/:comment_id", deleteComment)

module.exports = app;
