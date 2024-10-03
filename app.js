const express = require("express");
const cors = require("cors");
const app = express();

const {
  getAllComments,
  getGemComments,
  postComment,
  deleteComment,
  getAllUsers,
  getUserById,
  postUser,
  patchUser,
  getEndpoints,
  getGems,
  getGemByID,
  postGem,
  patchGem
} = require("./controllers/index.controllers");

const {
  handlePSQLErrors,
  handleCustomErrors,
  handleServerErrors,
} = require("./errors/errors");

app.use(express.json());
app.use(cors());

app.get("/api", getEndpoints);

app.get("/api/users", getAllUsers);

app.get("/api/users/:user_id", getUserById);

app.post("/api/users", postUser);

app.patch("/api/users/:user_id", patchUser);

app.get("/api/gems", getGems);

app.get("/api/gems/:gem_id", getGemByID);

app.post("/api/gems", postGem);

app.patch("/api/gems/:gem_id", patchGem);

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
