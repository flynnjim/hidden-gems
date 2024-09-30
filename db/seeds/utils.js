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