const { generateAuthToken } = require("../config/generateAuthToken");
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const path = require("path");

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please Enter all the fields");
  }
  const userExist = await User.findOne({ email });
  if (userExist) {
    res.status(400);
    throw new Error("User already exist");
  }
  // console.log("request", req.file);
  const imageUrl = req.file ? `/uploads/${req.file.filename}` : '';

  const user = await User.create({
    name,
    email,
    password,
    pic : imageUrl,
  });
  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      pic: user.pic,
      token: generateAuthToken(user._id),
      message: "Successfully Signed IN",
    });
  } else {
    res.status(400);
    throw new Error("Failed to create user");
  }
});
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (user && (await user.matchPassword(password))) {
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      pic: user.pic,
      token: generateAuthToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid Email or Password");
  }
});

// /api/user?search=piyush
const searchUsers = async (req, res) => {
  const query = req.query.search;
  if (!query) {
    res.status(200).send([]);
    return;
  }
  try {
    const users = await User.find({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { email: { $regex: query, $options: "i" } },
      ],
    })
      .find({ _id: { $ne: req.user._id } })
      .select("-password");
    // if (!users || users.length === 0) {
    //   res.status(404).send({ message: "No user found" });
    //   return;
    // }

    res.send(users || []);
  } catch (error) {
    res
      .status(404)
      .send({ message: "There is some problem try after some time" });
  }
};

module.exports = { registerUser, loginUser, searchUsers };
