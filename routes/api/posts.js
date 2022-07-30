const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require('body-parser');
const User = require('../../schemas/UserSchema');
const Post = require('../../schemas/PostSchema');

router.get("/", async (req, res, next)=>{

    var searchObj = req.query;

    if(searchObj.isReply !== undefined){  // it means isReply field exist

        var isReply = searchObj.isReply === "true";
        searchObj.replyTo = { $exists: isReply};
        delete searchObj.isReply;
    }

    var results = await getPosts(searchObj);
    return res.status(200).send(results);
})

router.get("/:id", async (req, res, next)=>{
    var postId = req.params.id;
    var postData = await getPosts({ _id: postId });
    postData = postData[0];
    console.log(results);
    
    var results = {
        postData: postData
    }

    // if post is reply
    if(postData.replyTo !== undefined){
        results.replyTo = postData.replyTo;
    }

    // loading all the replies
    results.replies = await getPosts({ replyTo: postId }); 
    return res.status(200).send(results);

    Post.find()
    .populate("postedBy")
    .populate("retweetData")
    .sort({"createdAt": -1})
    .then(async (results)=>{
        results =  await User.populate(results, {path: "retweetData.postedBy"});
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

    if(req.body.replyTo){
        postData.replyTo = req.body.replyTo;
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

// Like
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

// Retweet
router.post("/:id/retweet", async (req, res, next)=>{

    var postId = req.params.id;
    var userId = req.session.user._id;

    // Try and delete retweet
    // if retweet doesn't exist it means we never retweeted if exist it will get deleted.
    var deletedPost = await Post.findOneAndDelete({ postedBy: userId, retweetData: postId}) // find post contain userId and in retweetData contain this post id.
    .catch(error => {
        console.log(error);
        return res.sendStatus(400);
    })
        
    // if not null it means it found post - we have to delete it from User side also other wise we to add it.
    var option = deletedPost !=null ? "$pull" : "$addToSet";

    var repost = deletedPost;

    if(repost == null){
        // we are not putting some fields example content field because retweet content is empty.
        repost = await Post.create({ postedBy: userId, retweetData: postId })
        .catch(error => {
            console.log(error);
            return res.sendStatus(400);
        });
        
        

    }

    // Insert retweeted post                               // either add it or remove it.
    req.session.user = await User.findByIdAndUpdate(userId, { [option]: { retweets: repost._id }}, {new: true})
    .catch(error => {
        console.log(error);
        return res.sendStatus(400);
    })
                                                                                           

    
    
    // Insert user which retweet in post
    var post = await Post.findByIdAndUpdate(postId, { [option]: { retweetUsers: userId }}, {new: true})
    .catch(error => {
        console.log(error);
        return res.sendStatus(400);
    })
    
    res.status(200).send(post);
})

router.delete("/:id", async (req, res, next)=>{
    Post.findByIdAndDelete(req.params.id)
    .then(()=>{
        console.log("post deleted");
        res.sendStatus(202);
    })
    .catch((error)=>{
        console.log(error);
        res.sendStatus(400);
    })
})

async function getPosts(filter){
    var results = await Post.find(filter)
    .populate("postedBy")
    .populate("retweetData")
    .populate("replyTo")
    .sort({"createdAt": -1})
    .catch(error => {
        console.log(error);
    })

    results = await User.populate(results, {path: "replyTo.postedBy"});
    
    return await User.populate(results, {path: "retweetData.postedBy"});
}

module.exports = router;