const db = require('../db/connection')

exports.removeComment = (comment_id) => {

    return db.query('DELETE FROM comments WHERE comment_id = $1 RETURNING *', [comment_id])
    .then((removedComment) => {
        if (removedComment.rowCount === 0) {
            return Promise.reject({msg: 'Comment not found', status: 404})
        } else {
            return removedComment.rows
        }
    })
    
}