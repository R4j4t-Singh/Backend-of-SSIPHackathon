const express = require("express")
const app = express()
const port = 4000
const cors = require("cors")
const mongoose = require("mongoose");
uae = 5;
// npm init
// npm i express cors nodemon
// they add a handy req.body object to our req,
// containing a Javascript
//  object representing the payload sent with the request

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors())


mongoose.connect("mongodb://localhost:27017/SSIPHackathon", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const UserDB = new mongoose.Schema({
	fname: {
        type: String, required: true
    },

    lname:String,

    email:{
        type: String, required: true, unique:true
    },

    mobile:{
        type: Number, required: true, unique:true
    },

    password:{
        type: String, required:true
    }
});


const IssuerDB = new mongoose.Schema({
	name: {
        type: String, required: true
    },

    email:{
        type: String, required: true, unique:true
    },

    mobile:{
        type: Number, required: true, unique:true
    },

    password:{
        type: String, required:true
    }
});

const User = mongoose.model("User", UserDB);


const Issuer = mongoose.model("Issuer", IssuerDB);


app.get("/", cors(), async (req, res) => {
	res.send("This is working")
})
app.get("/home", cors(), async (req, res) => {
    if(uae==0 && uae==1){
        res.send("Email already exists Please try to login")
    }
})



app.post("/post_user", async (req, res) => {
	let  name = req.body
	str = JSON.stringify(name);
    data = JSON.parse(str);
    console.log(data);
    User.find(function (err, fruits) {
        if (err) {
          console.log(err);
        } else {      
          fruits.forEach(function (fruit) {
           mail=  fruit.email;
           if (mail==data.Userdetails.Mail){
            console.log("User Already Exists Please Login");
            uae = 0;
           } else{
            console.log("hi")
            const user = new User({
                fname: data.Userdetails.Firstname,
                lname: data.Userdetails.Lastname,
                email: data.Userdetails.Mail,
                mobile:data.Userdetails.Mobilenumber,
                password:data.Userdetails.Password
              });
            
              user.save();

           }
     
          });
        }
      });
	

  

})



app.post("/post_issuer", async (req, res) => {
	let  name = req.body
	str = JSON.stringify(name);
    data = JSON.parse(str);
    console.log(data);
   
    Issuer.find(function (err, fruits) {
        if (err) {
          console.log(err);
        } 
        if(fruits){
          fruits.forEach(function (fruit) {
            mail=  fruit.email;
            if (mail==data.Userdetails.Mail){
             console.log("Issuer Already Exists Please Login")
             uae = 1
             mongoose.connection.close()
             
        }
           else{
            const issuer = new Issuer({
                name: data.Userdetails.Companyname,
                email: data.Userdetails.Mail,
                mobile:data.Userdetails.Mobilenumber,
                password:data.Userdetails.Password
              });
              
              issuer.save();
           }
          });
        }
        else{
          const issuer = new Issuer({
            name: data.Userdetails.Companyname,
            email: data.Userdetails.Mail,
            mobile:data.Userdetails.Mobilenumber,
            password:data.Userdetails.Password
          });
          
          issuer.save();
        }
      });

	  
})

app.listen(port, () => {
	console.log(`Listening at http://localhost:${port}`)
})