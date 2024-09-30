exports.convertTimestampToDate = ({ date, ...otherProperties }) => {
  if (!date) return { ...otherProperties };
  return { date: new Date(date), ...otherProperties };
};
