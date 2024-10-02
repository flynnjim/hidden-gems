const { selectGemComments } = require('../models/select-gem-comments.model')

exports.getGemComments = (req, res, next) => {
    const {params : {gem_id}} = req

    selectGemComments(gem_id)
    .then((comments) => { 
        res.status(200).json(comments)
    })
    .catch((err) => {
        next(err)
    })
}