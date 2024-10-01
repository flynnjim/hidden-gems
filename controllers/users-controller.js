// const { use } = require("../app");
const {
  fetchAllUsers,
  fetchUserById,
  createNewUser,
  updateUser,
} = require("../models/users-model");

exports.getAllUsers = (req, res, next) => {
  const { username } = req.body;
  fetchAllUsers(username)
    .then((usersData) => {
      res.status(200).send(usersData);
    })
    .catch((err) => {
      next(err);
    });
};

exports.getUserById = (req, res, next) => {
  const { user_id } = req.params;
  fetchUserById(user_id)
    .then((userData) => {
      res.status(200).send(userData);
    })
    .catch((err) => {
      next(err);
    });
};

exports.postUser = (req, res, next) => {
  const newUser = req.body;

  createNewUser(newUser)
    .then((userData) => {
      res.status(201).send(userData);
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchUser = (req, res, next) => {
  const { user_id } = req.params;
  const updatedUser = req.body;
  updateUser(user_id, updatedUser)
    .then((userData) => {
      res.status(200).send(userData);
    })
    .catch((err) => {
      next(err);
    });
};
