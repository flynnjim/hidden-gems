const { insertComment } = require("../models/insert-comment.model");

exports.postComment = (req, res) => {
  const { body } = req;
  insertComment(body)
    .then((commentNewData) => {
      res.status(201).json(commentNewData);
    })
    .catch((err) => {
      res.status(err.status).json(err);
    });
};
