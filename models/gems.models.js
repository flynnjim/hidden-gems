const db = require("../db/connection");

exports.selectAllGems = (sort_by = "date", order = "desc", category, date) => {

  const validSortByQueries = ["date", "rating"];

  const validOrders = ["desc", "asc", "DESC", "ASC"]

  const validFilters = ["date", "category", "type"]

  const validCategories = ["nature", "culture", "food"]

  if (!validSortByQueries.includes(sort_by)) {
    return Promise.reject({ status: 400, msg: "Bad Request" });
  } else if (!validOrders.includes(order)) {
    return Promise.reject({ status: 400, msg: "Bad Request" });
  }

  let sqlString = `SELECT * FROM gems GROUP BY gems.gem_id ORDER BY ${sort_by} ${order} `;

  const queryFilter = []

  if(category) {
    if(!validCategories.includes(category)) {
        return Promise.reject({
            status: 404,
            msg: "Not Found"
        })
    }
    else {
        sqlString = `SELECT * FROM gems WHERE category = $1 GROUP BY gems.gem_id ORDER BY ${sort_by} ${order}`
        queryFilter.push(category)
    }
  }

  if(date) {
    sqlString = `SELECT * FROM gems WHERE date = $1 GROUP BY gems.gem_id ORDER BY ${sort_by} ${order}`
    queryFilter.push(date)
  }
  
  return db.query(sqlString, queryFilter)
  .then(({ rows }) => {
    return rows;
  });
};

exports.selectGemsByID = (gem_id) => {
  return db
    .query("SELECT * FROM gems WHERE gems.gem_id = $1", [gem_id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "Not Found",
        });
      } else {
        return rows[0];
      }
    });
};

  /* RATING ISSUE
  // let sqlString = `SELECT gems.title, gems.description, gems.category, gems.img_url, gems.latitude, gems.longitude, gems.address, gems.date, gems.user_id, gems.type, avg(gems.rating) as avg_rating FROM gems GROUP BY gems.gem_id ORDER BY ${sort_by} desc `;

  //   let sqlString = `create function array_avg(_data anyarray)
  // returns numeric
  // as
  // $$
  //     select avg(a)
  //     from unnest(_data) as a
  // $$ language sql;

  // select avg(array_avg(gems.rating))
  // from gems;
  // `;


*/