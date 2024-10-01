const express = require("express");
const cors = require("cors");
const app = express();
const {getAllUsers} = require("./controllers/users-controller")

app.use(cors());
app.use(express.json());


app.get("/api/users", getAllUsers);

//Error Handling

app.all("/*", (req, res) => {
    res.status(404).send({ message: "Page not found!" });
  });

module.exports = app;
