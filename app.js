//jshint esversion:6

require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const encrypt = require("mongoose-encryption");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));

mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true, useUnifiedTopology: true});

///user schema //////////
const userSchema = new mongoose.Schema({
    email: String,
    password: String
});


//level1 - key for the encryption //You can either use a single secret string of any length; or a pair of base64                                          strings (a 32-byte encryptionKey and a 64-byte signingKey).
//const secret = "Thisisourlittlesecret."; 
                                        
//secrets moved to .env file                                        
                                        
//level1 - add encryption plugin to userSchema, add secret key and the fields we want to encrypt                                           
// level1 -userSchema.plugin(encrypt, {secret: secret, encryptedFields: ["password"]});

//level2 - create .env file and add secret encryption key and api ket to .env file
//console.log(process.env.API_KEY);//accessing secret encryption and api key form .env file

userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ["password"]});


const User = new mongoose.model("User", userSchema);

app.use(express.static("public"));
///home page////////////////
app.get("/",function(req, res){
    res.render("home");
});
///login page //////////////////////////
app.get("/login",function(req, res){
    res.render("login");
});
///register page //////////////////////////
app.get("/register",function(req, res){
    res.render("register");
});


///register user with email and password /////////////

app.post("/register",function(req, res){
    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    })
    
    newUser.save(function(err){
        if(err){
            console.log(err);
        }else{
            res.render("submit");
        }
    });
     
});


///check the user name and password is correct then login the user

app.post("/login", function(req, res){
    const userName = req.body.username;
    const password = req.body.password;
    
    User.findOne({email: userName}, function(err, foundUser){
        if(err){
            console.log(err);
        }else{
            if(foundUser){
                if(foundUser.password === password){
                    res.render("secrets");
                }else{
                    console.log("Email or Password is incorrect");
                }
            }else{
                console.log("User not found");
            }
        }
    });

});














app.listen(3000, function() {
  console.log("Server started on port 3000");
});

