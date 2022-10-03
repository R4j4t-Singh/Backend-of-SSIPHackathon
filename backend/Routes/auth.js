const express = require('express');
const User = require('../models/User');
const Issuer = require('../models/Issuer');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var fetchuser = require('../middleware/fetchuser');
var fetchissuer = require('../middleware/fetchissuer');


const JWT_SECRET = 'iloveyou';

// ROUTE 1: Create a User using: POST "/api/auth/createuser". No login required
router.post('/createuser', [
  body('fname', 'Enter a valid First name').isLength({ min: 3 }),
  body('lname', 'Enter a valid Last name').isLength({ min: 3 }),
  body('email', 'Enter a valid email').isEmail(),
  body('mobile', 'Enter a valid Mobile').isLength({ min: 9 }),
  body('password', 'Password must be atleast 5 characters').isLength({ min: 5 }),
], async (req, res) => {
  // If there are errors, return Bad request and the errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    // Check whether the user with this email exists already
    let user = await User.findOne({ email: req.body.email });
    if (user) {
      return res.status(400).json({ error: "Sorry a user with this email already exists" })
    }
    const salt = await bcrypt.genSalt(10);
    const secPass = await bcrypt.hash(req.body.password, salt);

    // Create a new user
    user = await User.create({
      fname: req.body.fname,
      lname: req.body.lname,
      email: req.body.email,
      mobile: req.body.mobile,
      password: secPass,
    });
    const data = {
      user: {
        id: user.id
      }
    }
    const authtoken = jwt.sign(data, JWT_SECRET);


    // res.json(user)
    res.json({ authtoken })

  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
})


// ROUTE 2: Create a issuer using: POST "/api/auth/create/issuer". No login required
router.post('/createissuer', [
    body('name', 'Enter a valid company name').isLength({ min: 3 }),
    body('email', 'Enter a valid email').isEmail(),
    body('mobile', 'Enter a valid Mobile').isLength({ min: 9 }),
    body('password', 'Password must be atleast 5 characters').isLength({ min: 5 }),
  ], async (req, res) => {
    // If there are errors, return Bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      // Check whether the issuer with this email exists already
      let issuer = await Issuer.findOne({ email: req.body.email });
      if (issuer) {
        return res.status(400).json({ error: "Sorry a issuer with this email already exists" })
      }
      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(req.body.password, salt);
  
      // Create a new issuer
      issuer = await Issuer.create({
        name: req.body.name,
        mobile: req.body.mobile,
        password: secPass,
        email: req.body.email,
      });
      const data = {
        issuer: {
          id: issuer.id
        }
      }
      const authtoken = jwt.sign(data, JWT_SECRET);
  
  
      // res.json(issuer)
      res.json({ authtoken })
  
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  })


// ROUTE 3: Authenticate a User using: POST "/api/auth/login". No login required
router.post('/loginuser', [
  body('email', 'Enter a valid email').isEmail(),
  body('password', 'Password cannot be blank').exists(),
  body('person', 'Please select either you are a person or a issuer').exists(),
], async (req, res) => {
  let success = false;
  // If there are errors, return Bad request and the errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password, person } = req.body;
  if(person == "user"){
    try {
        let user = await User.findOne({ email });
        if (!user) {
          success = false
          return res.status(400).json({ error: "Please try to login with correct credentials" });
        }
    
        const passwordCompare = await bcrypt.compare(password, user.password);
        if (!passwordCompare) {
          success = false
          return res.status(400).json({ success, error: "Please try to login with correct credentials" });
        }
    
        const data = {
          user: {
            id: user.id
          }
        }
        const authtoken = jwt.sign(data, JWT_SECRET);
        success = true;
        res.json({ success, authtoken })
    
      } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
      }
    
  }
    else if(person == "issuer"){
        try {
          let issuer = await Issuer.findOne({ email });
          if (!issuer) {
            success = false
            return res.status(400).json({ error: "Please try to login with correct credentials" });
          }
      
          const passwordCompare = await bcrypt.compare(password, issuer.password);
          if (!passwordCompare) {
            success = false
            return res.status(400).json({ success, error: "Please try to login with correct credentials" });
          }
      
          const data2 = {
            issuer: {
              id: issuer.id
            }
          }
          const authtoken = jwt.sign(data2, JWT_SECRET);
          success = true;
          res.json({ success, authtoken })
      
        } catch (error) {
          console.error(error.message);
          res.status(500).send("Internal Server Error");
        }
    }
  

});



// ROUTE 4: Get loggedin User Details using: POST "/api/auth/getuser". Login required
router.post('/getuser', fetchuser,  async (req, res) => {

  try {
    userId = req.user.id;
    const user = await User.findById(userId).select("-password")
    res.send(user)
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
})
router.post('/getissuer', fetchissuer,  async (req, res) => {

    try {
      issuerId = req.issuer.id;
      const issuer = await Issuer.findById(issuerId).select("-password")
      res.send(issuer)
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  })
module.exports = router