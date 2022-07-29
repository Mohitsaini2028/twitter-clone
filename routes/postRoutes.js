const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require('body-parser');
const bcrpyt = require('bcryptjs');
const User = require('../schemas/UserSchema');


app.set("view engine", "pug");
app.set("views", "views");

router.get("/:id", (req, res, next)=>{

    var payload = {
        pageTitle: "View post",
        userLoggedIn: req.session.user,
        userLoggedInJs: JSON.stringify(req.session.user),
        postId: req.params.id
    }


    res.status(200).render("postPage", payload);
})



module.exports = router;