exports.handlePSQLErrors = (err, req, res, next) => {
  if (err.code === "22P02" || err.code === "23502" || err.code === "42703") {
    res.status(400).send({ msg: "Bad request" });
  } else if (err.code === "23505") {
    res.status(409).send({ msg: "User already exists!" });
  } else {
    next(err);
  }
};

exports.handleCustomErrors = (err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else next(err);
};

exports.handleServerErrors = (err, req, res, next) => {
  res.status(500).send({ msg: `SERVER ERROR: ${err}` });
};
