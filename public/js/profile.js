$(document).ready(() => {
    if(selectedTab === "replies"){
        loadReplies();
    }
    else{
        console.log("Prpflfbd")
        loadPosts();
    }
});

function loadPosts(){
     console.log("SELECTED TAB",selectedTab);
    $.get("/api/posts", { postedBy: profileUserId , isReply: false },(results)=>{    
        outputPosts(results, $(".postsContainer"));  
    })
}

function loadReplies(){
    console.log("SELECTED TAB",selectedTab);
   $.get("/api/posts", { postedBy: profileUserId , isReply: true },(results)=>{    
       outputPosts(results, $(".postsContainer"));  
   })
}