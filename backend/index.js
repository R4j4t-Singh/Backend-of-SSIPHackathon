const express = require("express")
const app = express()
const port = 4000
const cors = require("cors")
const mongoose = require("mongoose");
const md5 = require("md5");

Userfound = 0

mongoose.connect("mongodb://localhost:27017/SSIPHackathon", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});


app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors())



// app.use('/api/authuser', require('./routes/authuser'))
// app.use('api/authissuer', require('./routes/authissuer'))
// app.use('/api/certifications', require('./routes/certifications'))


const User = require("./Models/User")


const Issuer = require("./Models/Issuer")





app.get("/", cors(), async (req, res) => {
	res.send("This is working")
})
app.get("/home", cors(), async (req, res) => {
        if(Userfound){
            res.send("welcome")
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