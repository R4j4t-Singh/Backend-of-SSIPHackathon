const mongoose = require("mongoose");

const studentslistDB = new mongoose.Schema({
	
    Name:{
        type: String, required: true
    },
    Grade:{
        type: String, required: true
    },
    StudentEmail:{
        type: String, required: true, unique:true
    },

    Certificateid:{
        type: Number, required: true, unique:true
    },

});

module.exports = mongoose.model("studentslist", studentslistDB);