const { getAllComments } = require("./get-all-comments.controller");
const { getGemComments } = require("./get-gem-comments.controller");
const { postComment } = require("./post-new-comment.controller");
const { deleteComment } = require("./delete-comment.controller");
const { getEndpoints } = require("./endpoints-controller");
const { getGems, getGemByID } = require("./gems.controllers");
const { postGem } = require("./post-gems-controller");
const { patchGem } = require("./patch-gems-controller");
const {
  getAllUsers,
  getUserById,
  postUser,
  patchUser,
} = require("./users-controller");


module.exports = {
  getAllComments,
  getGemComments,
  postComment,
  deleteComment,
  getAllUsers,
  getUserById,
  postUser,
  patchUser,
  getEndpoints,
  getGems,
  getGemByID,
  postGem,
  patchGem
};
