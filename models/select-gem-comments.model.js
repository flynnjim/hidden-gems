const db = require("../db/connection");

exports.selectGemComments = (gem_id, sort_by, order) => {
  const validSorting = ["date"];
  const validOrder = ["ASC", "DESC"];

  const regex = /\D/;

  if (regex.test(gem_id)) {
    return Promise.reject({ msg: "Bad request", status: 400 });
  }
  if (!validSorting.includes(sort_by) && sort_by) {
    return Promise.reject({ msg: "Bad request", status: 400 });
  }
  if (order && !validOrder.includes(order.toUpperCase())) {
    return Promise.reject({ msg: "Bad request", status: 400 });
  }

  let baseString = `SELECT * FROM comments WHERE gem_id = $1`;

  if (sort_by) {
    const sortOrder = order ? order : "ASC";

    baseString += ` ORDER BY ${sort_by} ${sortOrder}`;
  }

  return db.query(baseString, [gem_id]).then((res) => {
    if (res.rows.length === 0) {
      return Promise.reject({ msg: "Bad request", status: 404 });
    }
    return res.rows;
  });
};
