const express = require('express');
const router = express.Router();
const fetchuser = require('../Middleware/fetchuser');
const Course = require('../Models/CourseStudents');
const User = require('../models/User');

router.get('/fetchallusercertificates', fetchuser, async (req, res) => {
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

module.exports = router
