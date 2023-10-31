const bcrypt = require("bcrypt");
// const { request } = require('express')
// const { response } = require('../app')
const User = require("../models/user");
const Blogs = require("../models/blogData");

const usersRouter = require("express").Router();

usersRouter.get("/", async (request, response) => {
  const users = await User.find({}).populate("blogs", { title: 1 });

  response.json(users);
});
module.exports = usersRouter;
