const comments = require("../db/data/test-data/comments");
const { selectAllComments } = require("../models/select-all-comments.model");

exports.getAllComments = (req, res) => {
  selectAllComments().then((comments) => {
    res.status(200).json(comments);
  });
};
