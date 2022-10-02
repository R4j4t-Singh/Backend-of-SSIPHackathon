const mongoose = require("mongoose");

const CertificationsDB = new mongoose.Schema({
	
    Certificateid:{
        type: Number, required: true, unique:true
    },

    studentemail:{
        type: String, required: true
    },

    Nameofperson:{
        type: String, required: true
    },
    coursename:{
        type: String, required: true
    },
    Issuername:{
        type: String, required: true
    },
    Grade:{
        type: String, required: true
    },


});

module.exports = mongoose.model("Certifications", CertificationsDB);