const db = require("../db/connection");

exports.selectAllGems = (
  sort_by = "date",
  order = "desc",
  category,
  date,
  type
) => {
  const validSortByQueries = ["date", "rating"];

  const validOrders = ["desc", "asc", "DESC", "ASC"];

  const validCategories = ["nature", "culture", "food"];

  // add valid types

  // add logic to ensure only acceptable date formats are inserted as the below code will not work as a 'catch-all'
  // const validFilters = ["date", "category", "type"];

  if (!validSortByQueries.includes(sort_by)) {
    return Promise.reject({ status: 400, msg: "Bad request" });
  } else if (!validOrders.includes(order)) {
    return Promise.reject({ status: 400, msg: "Bad request" });
  }

  let sqlString = `SELECT gems.title, gems.description, gems.category, gems.img_url, gems.latitude, gems.longitude, gems.address, gems.date, gems.user_id, gems.gem_id, gems.type, avg((select avg(a) from unnest(gems.rating) as a))AS rating FROM gems `;

  const queryFilter = [];

  if (category && date) {
    sqlString += `WHERE category = $1 AND gems.date::date = $2::date`;
    queryFilter.push(category, date);
  } else if (type && date) {
    sqlString += `WHERE type = $1 AND gems.date::date = $2::date`;
    queryFilter.push(type, date);
  } else if (category) {
    if (!validCategories.includes(category)) {
      return Promise.reject({
        status: 404,
        msg: "Not found",
      });
    } else {
      sqlString += `WHERE category = $1`;
      queryFilter.push(category);
    }
  } else if (date) {
    sqlString += `WHERE gems.date::date = $1::date`;
    queryFilter.push(date);
  }

  sqlString += ` GROUP BY gems.gem_id ORDER BY ${sort_by} ${order}`;

  return db.query(sqlString, queryFilter).then(({ rows }) => {
    return rows;
  });
};

exports.selectGemsByID = (gem_id) => {
  return db
    .query(
      "SELECT gems.title, gems.description, gems.category, gems.img_url, gems.latitude, gems.longitude, gems.address, gems.date, gems.user_id, gems.gem_id, gems.type, avg((select avg(a) from unnest(gems.rating) as a))AS rating FROM gems WHERE gems.gem_id = $1 GROUP BY gems.gem_id",
      [gem_id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "Not found",
        });
      } else {
        return rows[0];
      }
    });
};

// select  *
// from events
// where event_date between '2020-01-01 12:00:00' and '2020-01-01 23:30:00';

// 2023-10-05 7:00:00

// SELECT TOP 3 REPLACE(CONVERT(CHAR(10), ExpectedDeliveryDate, 110), '/', '-') ExpectedDeliveryDateFormattedAsText
// FROM Purchasing.PurchaseOrders
// WHERE OrderDate < @Datetime;
