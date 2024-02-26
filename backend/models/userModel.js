const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const userSchema = mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, unique: true },
    password: { type: String, required: true, trim: true },
    pic: {
      type: Buffer,
      // default:
      //   "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIcAAACHCAMAAAALObo4AAAAY1BMVEX////MzMxNTU3JycnR0dFJSUnU1NRGRkb5+fnv7+8/Pz9DQ0Pc3NzY2Njq6upiYmKlpaXk5OSFhYWLi4tXV1fAwMBtbW2xsbE5OTm4uLh0dHSSkpKZmZk0NDSfn599fX0sLCyaAgjxAAAEnElEQVR4nO2aDXOjLBDHiwIqSlSML9Emve//KU9Nc9MmuwiIeWae4T9z7U2npj93l30BPj6CgoKCgoKCgoKCgv6XStPsVNdFUdT1KUvT/4ahLjiJ77p/J7yo38uSZnL5u6+afyqzd7FkkkAM/1CIzN5AceKgJX6j8NPRFDpT/EQhR5Jk1IxiJaGHeacwp1hJikMoMjuKBSQ+wCSWxjjKJNwFY4kSrxQp/pcoX0TxX/DomwyFIG2lxnFUVUtQFG8gaITyqktEwlgyf+0qjvyWr2jFMPhFCBY9xIS4ICR+QBCn0FZFz1It4hwfIDAFbVj+wpEwhYTJfgzQ1rwqXylWkggOk93LF0xfdPoRGE8Sn5BF9iY0MEb5BBvjrryBLLIzVkFr9DqM2SITCLIHA/SKLFGnfAcJyLHDM6BXaD/oMSLRgyHi7hl4DW6ZI4pK8DnnNXMCE2mrj45FeQs9GLu2ivBbVWKTQ1Q+sxlsDv6VbHIkCkxmjgaBqxYfN8MjYh3yrAsGUmZ5uYkxByrM4bRkJPhRhJwNOM7Is9IeA2sFYyMOrHOyn32x7mcXh4NjJPZKe/wS2zsG7Ul3xKlDtUtRDpN1O6IctgFSoxyNQR4DW5CVo7bkKJAPIvTToL6APdkq2+qPvdCu+kKsiy4+SEoDjrzCkqBtBsHD9HVqgQQXOmIdqPhmx9WI44o9bpnJ4Jo/u/e2HaWrZ25IhFjWfmzZUrWdPRYxhXHYLVw0fRhksZVjxPxix4HuQnWGHB3GYZdAMA76ZcjxhfnFE4dB9liEZzI7DjQ+6NYQddeAYfiKU5N2fS50X54KHZY/ZseYJJAcdYtl/sDzaWvkF3CgWzns8ilaX+b+A9+D+RYTDVpvLeuLZuOW9Bs5hHXgvP8ty4ZM80n0smGPi+Zh25EO7cdmtfqW/YwGB7Hvx9CFu2iDQ/OkdX+KB+oyOugChKFDA3Ho19H5ZeFo7PcLHxy2GOiYvajXFZmh12DYz3PaYzDdTAdvjn1z2M+3ugyi6w7RjnCVw1k3OmjP4jgHuHn6kMP+h9YxEk2prNMEltsWqubF8GEbH7GJ4/4YXvt1XUii4XDdQMVfjCosQHJsYFjkhqExCEVPPvIJL/nOVw/wqR3dfNBsObifScFLhlJeKDQ+VIGcKu85CQLGBxr3k+oQikWdmvr4lWTfydgzB5VVKfJEW2+TXJSVfCbZdR715BkeV6Xh/FL28a8FvPcs+Uc/RNvprLXEb6ucpx+nyvsvYDw+i9MmMtv7eCiPGvqwiYfrF3eKthEmg9xvJaJp7yT7MT4yQslFRfYUK0mkLvPzXq62ZVWXu1GsJHlXebp4IQfT6ITEBpeuAxSN3EFY5PGKkDRery8YiTdrLEpLs32gZ4nS8+3L9NMFRHz6pVhErnZpbE5kVx9540XpZLVu2DAddSNWlpt7MP8oROk1QJ/URkY2YQNrD6RYScZhK06SYTyaYlZaqLPQzJXirIo3XZXOYjX8ES+5jSXij1BHXDrVqO6bMRqugxAin//N/4vGprfd7vGiNDvJtq9ut1vVt/L0tovrQUFBQUFBQUFBQUHv1V/DR0P10XBrFAAAAABJRU5ErkJggg==",
    },
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
  // console.log('userSchema ', ans);
  return ans;

};

const User = mongoose.model("User", userSchema);

module.exports = User;
