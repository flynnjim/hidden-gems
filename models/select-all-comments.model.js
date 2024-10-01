const db = require("../db/connection");

exports.selectAllComments = () => {
  return db.query("SELECT * FROM comments").then((result) => {
    return result.rows;
  });
};
