exports.convertTimestampToDate = ({ date, img_url, rating, ...otherProperties }) => {
  const formatImg = JSON.stringify(img_url)
  const formatRating = JSON.stringify(rating)
  if (!date) return { date: null, img_url: formatImg, rating: formatRating, ...otherProperties };
  // console.log({date: new Date(date), ...otherProperties})
  return { date: new Date(date), img_url: formatImg, rating: formatRating, ...otherProperties };
};
