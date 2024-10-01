const express = require("express");
const cors = require("cors");
const app = express();
const { getGems, getGemByID } = require("./controllers/gems.controllers");

app.use(cors());
app.use(express.json());

app.get("/api/gems", getGems);
app.get("/api/gems/:gem_id", getGemByID);

// Error Handling

app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else if (err.code === "22P02") {
    res.status(400).send({ msg: "Bad Request" });
  } else {
    next(err);
  }
})

app.all("*", (req, res, next) => {
    res.status(404).send({msg: "Requested Endpoint Not Found!"})
})

module.exports = app;
