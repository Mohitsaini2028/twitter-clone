const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const User = require('../schemas/UserSchema');
const bcrpyt = require('bcryptjs');
const session = require("express-session");



app.set("view engine", "pug");
app.set("views", "views");


// app.use(bodyParser.urlencoded({extended: false}));



router.get("/", (req, res, next)=>{

    res.status(200).render("register");
})


router.post("/", async (req, res, next)=>{

    
    var firstName = req.body.firstName.trim();
    var lastName = req.body.lastName.trim();
    var username = req.body.username.trim();
    var email = req.body.email.trim();
    var password = req.body.password;
    
    var payload = req.body;

    if(firstName && lastName && username && email && password){
        var user = await User.findOne({ 
            $or: [
                {username: username},
                {email: email}
            ]    
        })
        .catch((error)=>{
            console.log(error);
            payload.errorMessage = "Something went Wrong!"
            res.status(200).render("register", payload);
        })
        
        if(user == null){
            // No user found        
            var data = req.body;

            data.password = await bcrpyt.hash(password, 10);
            
            User.create(data)
            .then((user)=>{
                console.log("User Registered"+user);
                req.session.user = user;
                console.log(req.session.user);
                return res.redirect('/');   // redirecting the registered user to the home page.
            })

            // payload.successMessage = 'User Register Successfully';
            // res.status(200).render("register", payload);

        }
        else{
            // User Found
            if(email == user.email)
                payload.errorMessage = "Email already in use.";
            else
                payload.errorMessage = "Username already in use.";
            res.status(200).render("register", payload);
            
        }

        

    }
    else{       
        payload.errorMessage = "Make sure each field has a valid value."
        res.status(200).render("register", payload);
    }
    console.log(req.body);

})


module.exports = router;