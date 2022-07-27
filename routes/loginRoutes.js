const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require('body-parser');
const User = require('../schemas/UserSchema');
const bcrpyt = require('bcryptjs');

// app.use(bodyParser.urlencoded({extended: false}));


app.set("view engine", "pug");
app.set("views", "views");

router.get("/", (req, res, next)=>{

    var payload = {
        pageTitle: "Login" 
    }

    res.status(200).render("login", payload);
})


router.post("/", async (req, res, next)=>{

    var payload = req.body;

    if(req.body.logUsername && req.body.logPassword){
        var user = await User.findOne({ 
            $or: [
                {username: req.body.logUsername},
            ]    
        })
        .catch((error)=>{
            console.log(error);
            payload.errorMessage = "Something went Wrong!";
            res.status(200).render("login", payload);
        });
        
        if(user!=null){
            var result = await bcrpyt.compare(req.body.logPassword, user.password);
            if(result === true){
                req.session.user = user;
                console.log("User logged in");
                return res.redirect("/"); // Home page
            }    
        }

        payload.errorMessage = "Login credentials incorrect!"
        return res.status(200).render("login", payload);
    }

    // if user didn't enter any of the feild. 
    payload.errorMessage = "Make sure each field has a valid value.";                
    return res.status(200).render("login", payload);

})

module.exports = router;