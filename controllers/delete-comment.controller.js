const {removeComment} = require('../models/delete-comment.model')

exports.deleteComment = (req, res) => {
    const { params: {comment_id} } = req
    removeComment(comment_id)
    .then(() => {
        res.status(204).json()
    })
    .catch((err) => {
        if (err.code === '22P02') {
            res.status(400).json({msg: 'Invalid comment_id'})
        } else {
            res.status(err.status).send(err)
        }
    })
}