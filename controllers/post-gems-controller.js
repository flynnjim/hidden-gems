const { createNewGem } = require("../models/post-gems-model");

exports.postGem = (req, res, next) => {
  let newGem = req.body;
  createNewGem(newGem)
    .then((user) => {
      res.status(201).send(user);
    })
    .catch((err) => {
      next(err);
    });
};
