const db = require("../db/connection")

exports.selectAllGems = () => {
    return db.query("SELECT * FROM gems")
    .then(({rows}) => {
        return rows
    })
}

exports.selectGemsByID = (gem_id) => {
    return db.query("SELECT * FROM gems WHERE gems.gem_id = $1", [gem_id])
    .then(({rows}) => {
        if (rows.length === 0) {
            return Promise.reject({
                status: 404,
                message: "Not Found"
            })
        } else {
            return rows[0]
        }
    })
}