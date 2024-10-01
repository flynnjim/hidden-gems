const express = require("express");
const cors = require("cors");
const app = express();
const { getAllUsers, getUserById } = require("./controllers/users-controller");
const {
  handlePSQLErrors,
  handleCustomErrors,
  handleServerErrors,
} = require("./errors/users-errors");

app.use(cors());
app.use(express.json());

app.get("/api/users", getAllUsers);

app.get("/api/users/:user_id", getUserById);

//Error Handling

app.use(handlePSQLErrors);
app.use(handleCustomErrors);
app.use(handleServerErrors);
app.all("/*", (req, res) => {
  res.status(404).send({ msg: "Page not found!" });
});

module.exports = app;
