const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require('body-parser');
const User = require('../../schemas/UserSchema');
const Post = require('../../schemas/PostSchema');

router.get("/", (req, res, next)=>{

    Post.find()
    .populate("postedBy")
    .sort({"createdAt": -1})
    .then((results)=>{
        res.status(200).send(results);
    })
    .catch(error => {
        console.log(error);
        res.sendStatus(400);
    })
})


router.post("/", async (req, res, next)=>{

    if(!req.body.content){
        console.log("Content param not send with request");
        return res.sendStatus(400);
    }

    var postData = {
        content: req.body.content,
        postedBy: req.session.user
    }

    Post.create(postData)
    .then(async (newPost)=>{
        newPost = await User.populate(newPost, {path: "postedBy" });
        return res.status(201).send(newPost); 
    })
    .catch((error)=>{
        console.log(error);
        return res.sendStatus(400);
    })
    
    // res.status(200).send("it worked");
    
})

router.put("/:id/like", async (req, res, next)=>{

    var postId = req.params.id;
    var userId = req.session.user._id;

    // if post id exist in user likes
                    // if user likes exist  //then check if user like this post.
    var isLiked = req.session.user.likes && req.session.user.likes.includes(postId);

    var option = isLiked ? "$pull" : "$addToSet";

    // Insert user like         
                    // User.findByIdAndUpdate(userId, { [option]: { likes: postId }})     
    req.session.user = await User.findByIdAndUpdate(userId, { [option]: { likes: postId }}, {new: true})
    .catch(error => {
        console.log(error);
        return res.sendStatus(400);
    })
                                                                                            // it will return updated user.

    // User.findByIdAndUpdate(userId, { [option]: { likes: postId }}, function (err, docs) {
    //     if (err){
    //         console.log(err)
    //     }
    //     else{
    //         console.log("Updated User : ", docs);
            
    //     }
    // });
    
    
    // Insert post like
    var post = await Post.findByIdAndUpdate(postId, { [option]: { likes: userId }}, {new: true})
    .catch(error => {
        console.log(error);
        return res.sendStatus(400);
    })
    
    res.status(200).send(post);
})



module.exports = router;