const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { body, validationResult } = require("express-validator");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/fetchuser')

const JWT_SECRET = "your_jwt_secret";

//Route - 1 => Create a User using: POST "/api/auth". Doesn't reqiure Auth
router.post("/createUser",
  [
    body("name", "Enter a valid Name").isLength({ min: 3 }),
    body("email", "Enter a valid Email").isEmail(),
    body("password", "Password must be minimum 5 chracters").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      let user = await User.findOne({ email: req.body.email });

      if (user) {
        return res
          .status(400)
          .json({ error: "Sorry a User with this Email already exists" , success});
      }

      const salt = await bcrypt.genSalt(10);
      const secPass = await  bcrypt.hash(req.body.password, salt);

      //Create a New User
      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secPass,
      });
      const data  = {
        user:{
            id: user.id
        }
    }
    const authtoken = jwt.sign(data, JWT_SECRET);
    success = true;
    
      res.json({"authtoken": authtoken, success});

    } catch (error) {
      console.error(error.message);
      res.status(500).send("Some Error Occured", success);
    }
  }
);

//Authenticate a User
//Route - 2 => Login with your Credentials

router.post("/login",
    [
      body("email", "Enter a valid Email").isEmail(),
      body("password", "Password cannot be blank").exists(),
    ], async (req, res) => {
      let success = false;
        //If there are errors,return Bad requests and the errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({success, errors: errors.array() });
        } 

        const {email, password} = req.body;
        try {
            let user = await User.findOne({email});
            if(!user){
                return res.status(400).json({success, error: "Please try to Login with correct credentials"});
            }

            const passwordCompare = await bcrypt.compare(password, user.password);
            if(!passwordCompare){
                return res.status(400).json({success, error: "Please try to Login with correct credentials"});
            } 

            const data  = {
                user:{
                    id: user.id
                }
            }
            const authtoken = jwt.sign(data, JWT_SECRET);
            success = true;

            res.json({success, "authtoken": authtoken});

        } catch (error) {
            console.error(error.message);
            res.status(500).send("Internal Server Error").json(success);
        }
})

//Route- 3 Get logged User Details 

router.post("/getuser", fetchuser, async (req, res) => {

try {
    let userid = req.user.id;
    const user = await User.findById(userid).select("-password");
    res.send(user);
} catch (error) {
            console.error(error.message);
            res.status(500).send("Internal Server Error");
        }
})
module.exports = router;
