const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const userSchema = mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, unique: true },
    password: { type: String, required: true, trim: true },
    pic: String,
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  const user = this;

  // console.log("in pre");
  if (user.isModified("password")) {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    // console.log("hashing is done");
  }

  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  const user = this;
  const ans =  await bcrypt.compare(enteredPassword , user.password);
  return ans;

};

const User = mongoose.model("User", userSchema);

module.exports = User;
