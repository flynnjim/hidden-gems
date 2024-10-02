const db = require("../db/connection");

exports.updateVote = (gem_id, new_rating) => {
  return db.query(
    `UPDATE gems SET rating = array_append(rating, $1) WHERE gem_id = $2 RETURNING *;`,
    [new_rating, gem_id]
  );
};

exports.returnVote = (gem_id) => {
  return db
    .query(
      `SELECT ROUND(avg((select avg(a) from unnest(gems.rating) as a)), 1)AS rating FROM gems WHERE gem_id = $1`,
      [gem_id]
    )
    .then(({ rows }) => {
      if (rows[0].rating === null) {
        return Promise.reject({ status: 404, msg: "Not found" });
      }
      return rows[0];
    });
};
