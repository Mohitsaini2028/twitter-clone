const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require('body-parser');
const bcrpyt = require('bcryptjs');
const User = require('../schemas/UserSchema');


app.set("view engine", "pug");
app.set("views", "views");

router.get("/", (req, res, next)=>{

    var payload = {
        pageTitle: req.session.user.username,
        userLoggedIn: req.session.user,
        userLoggedInJs: JSON.stringify(req.session.user),
        profileUser: req.session.user
    }


    res.status(200).render("profilePage", payload);
})

async function getPayload(username, userLoggedIn){
    var user = await User.findOne({username: username})
    
    if(user == null){
        user = await User.findById(username);       // try with id if don't able to find by username

    
        if(user == null){
            return {
                pageTitle: "User not found",
                userLoggedIn: userLoggedIn,
                userLoggedInJs: JSON.stringify(userLoggedIn),
            }
        }
    }

    return {
        pageTitle: "User not found",
        userLoggedIn: userLoggedIn,
        userLoggedInJs: JSON.stringify(userLoggedIn),
        profileUser: user
    }

}

router.get("/:username", async (req, res, next)=>{

    var username = req.params.username;
    var userLoggedIn = req.session.user;
    console.log(username, userLoggedIn)
    var payload = await getPayload(username, userLoggedIn);

    // var payload = {
    //     pageTitle: "User not found",
    //     userLoggedIn: userLoggedIn,
    //     userLoggedInJs: JSON.stringify(userLoggedIn),
    //     profileUser: user
    // }

    console.log(payload);
    res.status(200).render("profilePage", payload);
})



module.exports = router;