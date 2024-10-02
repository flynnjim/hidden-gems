const express = require("express");
const cors = require("cors");
const app = express();
const { getEndpoints } = require("./controllers/endpoints-controller");
const { getGems, getGemByID } = require("./controllers/gems.controllers");
const {
  getAllUsers,
  getUserById,
  postUser,
  patchUser,
} = require("./controllers/users-controller");
const {
  handlePSQLErrors,
  handleCustomErrors,
  handleServerErrors,
} = require("./errors/errors");

app.use(express.json());
app.use(cors());

const { getAllComments } = require("./controllers/get-all-comments.controller");
const { getGemComments } = require("./controllers/get-gem-comments.controller");
const { postComment } = require("./controllers/post-new-comment.controller");
const { deleteComment } = require("./controllers/delete-comment.controller");

app.get("/api", getEndpoints);

app.get("/api/users", getAllUsers);

app.get("/api/users/:user_id", getUserById);

app.post("/api/users", postUser);

app.patch("/api/users/:user_id", patchUser);

app.get("/api/gems", getGems);

app.get("/api/gems/:gem_id", getGemByID);

app.get("/api/comments", getAllComments);

app.get("/api/comments/:gem_id", getGemComments);

app.post("/api/comments", postComment);

app.delete("/api/comments/:comment_id", deleteComment);

//Error Handling

app.use(handlePSQLErrors);
app.use(handleCustomErrors);
app.use(handleServerErrors);
app.all("/*", (req, res) => {
  res.status(404).send({ msg: "Page not found!" });
});

module.exports = app;
