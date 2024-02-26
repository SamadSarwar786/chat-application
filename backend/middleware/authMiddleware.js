
const dotenv = require('dotenv');
const User = require('../models/userModel');
const jwt = require("jsonwebtoken");

const protect = async (req,res,next) => {

    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer') ){
        try{
          const token = req.headers.authorization.split(' ')[1];
            // decoded token id 
            const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

            req.user = await User.findById(decoded.userId).select("-password");
            next();
        }
        catch(error){

            res.status(401).send({message:'Not Authorized token failed'});
        }
    }
    else res.status(401).send({message:'No token found'});
}

module.exports =protect;