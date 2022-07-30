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


router.get("/:username", async (req, res, next)=>{
    
    var username = req.params.username;
    var userLoggedIn = req.session.user;
    console.log(username, userLoggedIn)
    var payload = await getPayload(username, userLoggedIn);
    
    res.status(200).render("profilePage", payload);
})

router.get("/:username/replies", async (req, res, next)=>{

    var payload = await getPayload(req.params.username, req.session.user);
    payload.selectedTab = "replies";
    console.log(payload);
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
        pageTitle: user.username,
        userLoggedIn: userLoggedIn,
        userLoggedInJs: JSON.stringify(userLoggedIn),
        profileUser: user
    }

}



module.exports = router;