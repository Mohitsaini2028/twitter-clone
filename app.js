const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const middleware = require('./middleware');
const path = require('path');
const bodyParser = require('body-parser');
const db = require('./database');
var session = require("express-session");
var cookieParser = require('cookie-parser');

app.set("view engine", "pug");
app.set("views", "views");

app.use(bodyParser.urlencoded({extended: false}));
// serving the public folder
app.use(express.static(path.join(__dirname, "public")));

app.use(session({
    secret: "asf5467dnma23n#kz@cnj2gaskj3cln",
    resave: true,
    saveUninitialized: false

}))

// Routes
const loginRoute = require('./routes/loginRoutes');
const registerRoute = require('./routes/registerRoutes');
const logoutRoute = require('./routes/logoutRoutes');
const postRoute = require('./routes/postRoutes');
const profileRoute = require('./routes/profileRoutes');


// API routes
const postApiRoute = require('./routes/api/posts');

app.use('/login', loginRoute);
app.use('/register', registerRoute);
app.use('/logout', logoutRoute);
app.use('/posts', middleware.requireLogin, postRoute);
app.use('/profile', profileRoute);


app.use('/api/posts', postApiRoute);


app.get("/", middleware.requireLogin, (req, res, next)=>{

    var payload = {
        pageTitle: "Home",
        userLoggedIn: req.session.user,
        userLoggedInJs: JSON.stringify(req.session.user),
    }

    res.status(200).render("home", payload);
})


const server = app.listen(port, ()=> {
    console.log(`Server Listening at http://localhost:${port}`)
})