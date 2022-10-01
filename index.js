const express = require("express")
const app = express()
const port = 4000
const cors = require("cors")
const mongoose = require("mongoose");
const md5 = require("md5");
Userfound = 0

uae = 5;
int=0;
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
        type: Number, required: true
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
        type: Number, required: true
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
        if(Userfound){
            res.redirect("http://localhost:3000/issuerdash")
        }
    
})
app.post("/post_login", async (req, res) => {
    let  name = req.body
	str = JSON.stringify(name);
    data = JSON.parse(str);
    if(data.Userdetails.Person == 10){
        User.findOne({email:data.Userdetails.Mail},function(err,data2){
            if(data2){
            if(data2.password==md5(data.Userdetails.Password)) {
                console.log("Userfound")
               Userfound = 1;
            }
            else{
                console.log("Password Not Matched")
            }
            }
            else{
                console.log("Email Not Registered")
            }
            
            
                })
    }
    
   else if(data.Userdetails.Person == 20){
        Issuer.findOne({email:data.Userdetails.Mail},function(err,data2){
            if(data2){
                if(data2.password==md5(data.Userdetails.Password)) {
                    console.log("Issuerfound")
                }
                else{
                    console.log("Password Not Matched")
                }
                }
                else{
                    console.log("Email Not Registered")
                }
        })
    }

    else{
        console.log("Please Select if u are either User or Issuer")
    }

res.redirect("/home")
})

app.post("/post_user", async (req, res) => {
	let  name = req.body
	str = JSON.stringify(name);
    data = JSON.parse(str);
    console.log(data);
    hashedpwd=md5(data.Userdetails.Password)

  
    User.findOne({email:data.Userdetails.Mail},function(err,data2){
        if(!data2){
            var c;
            User.findOne({},function(err,data2){

                if (data2) {
                    console.log("if");
                    c = data.unique_id + 1;
                }else{
                    c=1;
                }

                var user = new User({
                    fname: data.Userdetails.Firstname,
                    lname: data.Userdetails.Lastname,
                    email: data.Userdetails.Mail,
                    mobile:data.Userdetails.Mobilenumber,
                    password:hashedpwd
                });

                user.save(function(err, Person){
                    if(err)
                        console.log(err);
                    else
                        console.log('Success');
                });

            }).sort({_id: -1}).limit(1);
            console.log({"Success":"You are regestered,You can login now."});
        }else{
            console.log({"Success":"Email is already used."});
        }

    });
	

  

})



app.post("/post_issuer", async (req, res) => {
	let  name = req.body
	str = JSON.stringify(name);
    data = JSON.parse(str);
    console.log(data);
    hashedpwd=md5(data.Userdetails.Password)
        Issuer.findOne({email:data.Userdetails.Mail},function(err,data2){
            if(!data2){
                var c;
                Issuer.findOne({},function(err,data2){

                    if (data2) {
                        console.log("if");
                        c = data.unique_id + 1;
                    }else{
                        c=1;
                    }
                    var issuer = new Issuer({
                        name: data.Userdetails.Companyname,
                        email: data.Userdetails.Mail,
                        mobile:data.Userdetails.Mobilenumber,
                        password:hashedpwd
                    });

                    issuer.save(function(err, Person){
                        if(err)
                            console.log(err);
                        else
                            console.log('Success');
                    });

                }).sort({_id: -1}).limit(1);
                console.log({"Success":"You are regestered,You can login now."});
            }else{
                console.log({"Success":"Email is already used."});
            }

        });
    
	
})

app.listen(port, () => {
	console.log(`Listening at http://localhost:${port}`)
})