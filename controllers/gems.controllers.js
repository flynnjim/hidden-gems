const { selectAllGems, selectGemsByID } = require("../models/gems.models")

exports.getGems = (request, response, next) => {
    selectAllGems()
    .then((gems) => {
        response.status(200).send({gems})
    })
    .catch((err) => {
        next(err)
    })
}

exports.getGemByID = (request, response, next) => {
    const { gem_id } = request.params
    selectGemsByID(gem_id)
    .then((gem) => {
        response.status(200).send({gem})
    })
    .catch((err) => {
        next(err)
    })
}