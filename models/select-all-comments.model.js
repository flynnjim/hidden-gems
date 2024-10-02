const db = require("../db/connection");

exports.selectAllComments = (sort_by, order) => {
  const validSorting = ["date"];
  const validOrder = ["ASC", "DESC"];

  if (!validSorting.includes(sort_by) && sort_by) {
    return Promise.reject({ msg: "Bad request", status: 400 });
  }
  if (order && !validOrder.includes(order.toUpperCase())) {
    return Promise.reject({ msg: "Bad request", status: 400 });
  }
  let baseString = "SELECT * FROM comments";
  if (sort_by) {
    const sortOrder = order ? order : "ASC";

    baseString += ` ORDER BY ${sort_by} ${sortOrder}`;
  }
  return db.query(baseString).then((result) => {
    return result.rows;
  });
};
