const db = require("../connection")

exports.formatGemsData = ({ date, img_url, rating, ...otherProperties }) => {
  const formatImg = `{${img_url.join(", ")}}`
  const formatRating = `{${rating.join(", ")}}`
  if (!date) return { date: null, img_url: formatImg, rating: formatRating, ...otherProperties };
  return { date: new Date(date), img_url: formatImg, rating: formatRating, ...otherProperties };
};

exports.convertTimestampToDate = ({ date, ...otherProperties }) => {
  if (!date) return { ...otherProperties };
  return { date: new Date(date), ...otherProperties };
}

exports.checkDateExists = (date) => {
  return db.query("SELECT gems.title, gems.description, gems.category, gems.img_url, gems.latitude, gems.longitude, gems.address, gems.date, gems.user_id, gems.gem_id, gems.type, avg((select avg(a) from unnest(gems.rating) as a))AS rating FROM gems WHERE gems.date::date = $1::date GROUP BY gems.gem_id", [date])
  .then(({rows}) => {
    if(rows.length === 0) {
      return Promise.reject({
        status: 404,
        msg: "Not found"
      })
    } else {return true}
  })
}