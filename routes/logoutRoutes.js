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

    if(req.session){
        req.session.destroy(()=>{
            console.log("User logout");
            res.redirect("/login");
        });
    }
})



module.exports = router;