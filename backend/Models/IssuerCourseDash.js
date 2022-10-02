const mongoose = require("mongoose");

const coursedashDB = new mongoose.Schema({

    CourseName:{
        type: String, required: true, unique:true
    },

    Students:{
        type: Number, required: true
    },

});

module.exports = mongoose.model("coursedash", coursedashDB);