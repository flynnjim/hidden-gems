const db = require('../db/connection')

exports.selectGemComments = (gem_id) => {

    const regex = /\D/

    if (regex.test(gem_id)) {
        return Promise.reject({msg: "Bad request", status: 400})
    }
  
    return db.query(`SELECT * FROM comments WHERE gem_id = $1`, [gem_id])
    .then((res) => {
        if (res.rows.length === 0) {
        return Promise.reject({msg: "Bad request", status: 404})
        }
        return res.rows    
    })

}