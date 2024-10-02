const db = require("../db/connection");

exports.createNewGem = (newGem) => {
  let queryString = `INSERT INTO gems
    (title, description, category, latitude, longitude, address, date, type, user_id, img_url)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, `;
  const values = [
    newGem.title,
    newGem.description,
    newGem.category,
    newGem.latitude,
    newGem.longitude,
    newGem.address,
    newGem.date,
    newGem.type,
    newGem.user_id,
  ];

  if (newGem.img_url) {
    values.push(newGem.img_url);
    queryString += `$10) RETURNING *;`;
  } else {
    queryString += `DEFAULT) RETURNING *;`;
  }

  return db.query(queryString, values).then(({ rows }) => {
    return rows[0];
  });
};
