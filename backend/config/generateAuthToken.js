const jwt = require("jsonwebtoken");

const generateAuthToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET_KEY, {
    expiresIn: "30d",
  });
};


module.exports={generateAuthToken}
