const mongoose = require("mongoose");

const studentslistDB = new mongoose.Schema({
    coursename:{
        type: String, required: true
    },
    issueremail:{
        type: String, required: true
    },
    StudentName:{
        type: String, required: true
    },
    Grade:{
        type: String, required: true
    },
    StudentEmail:{
        type: String, required: true
    },

    Certificateid:{
        type: Number
    },

});

module.exports = mongoose.model("studentslist", studentslistDB);