const {removeComment} = require('../models/delete-comment.model')

exports.deleteComment = (req, res, next) => {
    const { params: {comment_id} } = req
    removeComment(comment_id)
    .then(() => {
        res.status(204).json()
    })
    .catch((err) => {
        next(err)
    })
}