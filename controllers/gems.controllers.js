const { checkDateExists } = require("../db/seeds/utils");
const { selectAllGems, selectGemsByID } = require("../models/gems.models");

exports.getGems = (request, response, next) => {
  const { sort_by, order, category, date, type } = request.query;

  Promise.resolve().then(() => {
    if (date) {
        return checkDateExists(date)
    }
  })
  .then(() => {
    return selectAllGems(sort_by, order, category, date, type)
  })
  .then((gems) => {
    response.status(200).send({ gems });
  })
  .catch((err) => {
    next(err);
  });
};

exports.getGemByID = (request, response, next) => {
  const { gem_id } = request.params;
  selectGemsByID(gem_id)
    .then((gem) => {
      response.status(200).send({ gem });
    })
    .catch((err) => {
      next(err);
    });
};
