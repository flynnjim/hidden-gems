const { updateVote, returnVote } = require("../models/patch-gems-model");

exports.patchGem = (req, res, next) => {
  const { gem_id } = req.params;
  const { new_rating } = req.body;
  updateVote(gem_id, new_rating)
    .catch((err) => {
      next(err);
    })
    .then(() => {
      returnVote(gem_id)
        .then((vote) => {
          res.status(200).send(vote);
        })
        .catch((err) => {
          next(err);
        });
    });
};
