const express = require('express');
const User = require('../models/User');
const Issuer = require('../models/Issuer');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var fetchuser = require('../middleware/fetchuser');
var fetchissuer = require('../middleware/fetchissuer');
const Certificate = require('../Models/Certifications');
const Course = require('../Models/CourseStudents');


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
    res.json(user)
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
})

router.post('/getissuer', fetchissuer,  async (req, res) => {

    try {
      issuerId = req.issuer.id;
      const issuer = await Issuer.findById(issuerId).select("-password")
      res.json(issuer)
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  })

  // ROUTE 1: Get All the certificates using: GET "/api/courses//fetchallusercertificates". Login required

router.get('/fetchallusercertificates', fetchissuer, async (req, res) => {
    try {
        userId = req.user.id;
    const user = await User.findById(userId).select("-password")
    const course = await Course.find({StudentEmail: user.email})
    res.json(course)
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})


// ROUTE 2: Get All the certificates using: GET "/api/courses/fetchallissuercertificates". Login required

router.get('/fetchallissuercertificates', fetchissuer, async (req, res) => {
    try {
        issuerId = req.issuer.id;
        const issuer = await Issuer.findById(issuerId).select("-password")
    const certificate = await Certificate.find({issueremail: issuer.email})
    res.json(certificate)
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})

// ROUTE 3: Add a certificate using: POST "/api/courses/addcertificate". Login required

router.post('/addcertificate', fetchissuer, [
    body('coursename', 'Enter a valid title').isLength({ min: 3 }),
    body('Issuername', 'Description must be atleast 5 characters').isLength({ min: 5 }),
    body('certificatetype', 'Select a specific certificate').isLength({ min: 1 })
  ], async (req, res) => {
        try {
            const { coursename,issuername,certificatetype } = req.body;

            // If there are errors, return Bad request and the errors
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
             
            issueremail = req.issuer.email;
            const certificate = new Certificate({
                coursename,issuername,issueremail,certificatetype
            })
            const savedcertificate = await certificate.save()

            res.json(savedcertificate)

        } catch (error) {
            console.error(error.message);
            res.status(500).send("Internal Server Error");
        }
    })



    // ROUTE 4: Get All the students using: GET "/api/courses/fetchallstudents". Login required

router.get('/fetchallstudents/:id', fetchissuer, async (req, res) => {
    try {
     // Find the note to be updated and update it
        let certificate = await Certificate.findById(req.params.id);
        if (!certificate) { return res.status(404).send("Not Found") }

        cname = certificate.coursename;

        let course = await Course.find({coursename: cname});

        res.json({ course });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
    
})

// ROUTE 5: Add a Student in a course using: POST "/api/courses/addstudents". Login required

router.post('/addstudents', fetchissuer, [
    body('coursename', 'Enter a valid title').isLength({ min: 3 }),
    body('StudentName', 'Enter a valid name').isLength({ min: 3 }),
    body('StudentEmail', 'Enter a valid email').isEmail(),
    body('Grade', 'Enter a valid Grade').isLength({ min: 1 }),
], async (req, res) => {
        try {
            const {coursename,StudentName,StudentEmail,Grade} = req.body;

            // If there are errors, return Bad request and the errors
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            issueremail = req.issuer.email;
            issuername = req.issuer.name;

            const course = new Course({
                coursename,issueremail,StudentName,StudentEmail,Grade,issuername
            })
            const savedcourse = await course.save()

            res.json(savedcourse)

        } catch (error) {
            console.error(error.message);
            res.status(500).send("Internal Server Error");
        }
    })
    // ROUTE 6: fetch a certificate  using: POST "/api/courses/fetchcertificate" with params


    router.get('/fetchcertificate/:id', fetchuser, async (req, res) => {
        try {

            let course = await Course.findById(req.params.id);

              certificategenerate = {
            "coursename": course.coursename,
            "issuername": course.issuername,
            "studentname": course.studentname,
          }
          res.json(certificategenerate)

    } catch (error) {
            console.error(error.message);
            res.status(500).send("Internal Server Error");
        }
    })
    

module.exports = router