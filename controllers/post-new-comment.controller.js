const { insertComment } = require("../models/insert-comment.model");

exports.postComment = (req, res, next) => {
  const { body } = req;
  insertComment(body)
    .then((commentNewData) => {
      res.status(201).json(commentNewData);
    })
    .catch((err) => {
      next(err)
    });
};
