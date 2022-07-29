$(document).ready(()=>{

    $.get("/api/posts/" + postId, (results)=>{    
            outputPostsWithReplies(results, $(".postsContainer"));  // appending the result to the html
    })
});