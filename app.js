const express = require("express");
const cors = require("cors");
const app = express();
const { getGems, getGemByID } = require("./controllers/gems.controllers");

app.use(cors());
app.use(express.json());

app.get("/api/gems", getGems);
app.get("/api/gems/:gem_id", getGemByID);

// Error Handling

app.use((err, request, response, next) => {
  if (err.status && err.msg) {
    response.status(err.status).send({ msg: err.msg });
  } else if (err.code === "22P02") {
    response.status(400).send({ msg: "Bad Request" });
  } else {
    next(err);
  }
});

module.exports = app;
