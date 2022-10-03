const express = require('express');
const router = express.Router();
const fetchissuer = require('../Middleware/fetchissuer');
const Certificate = require('../Models/Certifications');
const Course = require('../Models/CourseStudents');
const Issuer = require('../Models/Issuer');
const User = require('../models/User');

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
    body('Issuername', 'Description must be atleast 5 characters').isLength({ min: 5 }),], async (req, res) => {
        try {
            const { coursename,issuername,issueremail} = req.body;

            // If there are errors, return Bad request and the errors
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            const certificate = new Certificate({
                coursename,issuername,issueremail
            })
            const savedcertificate = await certificate.save()

            res.json(savedcertificate)

        } catch (error) {
            console.error(error.message);
            res.status(500).send("Internal Server Error");
        }
    })



    // ROUTE 4: Get All the students using: GET "/api/courses/fetchallstudents". Login required

router.get('/fetchallstudents', fetchissuer, async (req, res) => {
    try {
        issuerId = req.issuer.id;
        const issuer = await Issuer.findById(issuerId).select("-password")

    const course = await Course.find({issueremail: issuer.email})
    res.json(course)
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
    body('issuername', 'Description must be atleast 5 characters').isLength({ min: 5 }),], async (req, res) => {
        try {
            const {coursename,issueremail,StudentName,StudentEmail,Grade} = req.body;

            // If there are errors, return Bad request and the errors
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            const course = new Course({
                coursename,issueremail,StudentName,StudentEmail,Grade
            })
            const savedcourse = await course.save()

            res.json(savedcourse)

        } catch (error) {
            console.error(error.message);
            res.status(500).send("Internal Server Error");
        }
    })


module.exports = router
