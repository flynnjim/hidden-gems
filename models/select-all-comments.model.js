const db = require("../db/connection");

exports.selectAllComments = (sort_by, order) => {
  const validSorting = ["date"];
  const validOrder = ["ASC", "DESC"];

  // console.log(order);
  // console.log(!validOrder.includes(order.toUpperCase()) && order, "?????");
  // console.log(!validSorting.includes(sort_by) && sort_by, "<<<<");

  if (!validSorting.includes(sort_by) && sort_by) {
    return Promise.reject({ msg: "Bad request", status: 400 });
  }
  // if (!validOrder.includes(order.toUpperCase()) && order) {
  //   console.log("reject");
  //   return Promise.reject({ msg: "Bad request", status: 400 });
  // }
  let baseString = "SELECT * FROM comments";
  if (sort_by) {
    const sortOrder = order ? order : "ASC";

    baseString += ` ORDER BY ${sort_by} ${sortOrder}`;
  }
  return db.query(baseString).then((result) => {
    return result.rows;
  });
};
