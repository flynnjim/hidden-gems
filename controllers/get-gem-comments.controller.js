const { selectGemComments } = require("../models/select-gem-comments.model");

exports.getGemComments = (req, res, next) => {
  const {
    params: { gem_id },
  } = req;
  const {
    query: { sort_by, order },
  } = req;

  selectGemComments(gem_id, sort_by, order)
    .then((comments) => {
      res.status(200).json(comments);
    })
    .catch((err) => {
      next(err);
    });
};
