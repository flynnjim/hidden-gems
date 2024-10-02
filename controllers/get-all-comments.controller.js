const { selectAllComments } = require("../models/select-all-comments.model");

exports.getAllComments = (req, res, next) => {
  const {
    query: { sort_by, order },
  } = req;
  selectAllComments(sort_by, order)
    .then((comments) => {
      res.status(200).json(comments);
    })
    .catch((err) => {
      next(err);
    });
};
