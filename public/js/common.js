$('#PostTextarea, #replyTextarea').keyup((event)=> {
    var textbox = $(event.target);
    var value = textbox.val().trim();

    var isModal = textbox.parents(".modal").length == 1;

    
    var submitButton = isModal ? $('#submitReplyButton') : $('#submitPostButton');

    if(submitButton.length == 0) return alert("d");
    
    if(value==""){
        submitButton.prop("disabled", true);
        return;
    }
    
    submitButton.prop("disabled", false);
});

$('#submitPostButton').click((event)=>{
    var button = $(event.target);
    var textbox = $('#PostTextarea');
    
    var data = {
        content: textbox.val()
    }

    $.post("/api/posts", data, (postData, status, xhr)=>{
        
        var html = createPostHtml(postData);
        $('.postsContainer').prepend(html);
        textbox.val("");
        button.prop("disabled", true);
        
    })
});

                // show bootstrap modal
$("#replyModal").on("show.bs.modal", (event)=>{

    var button = $(event.relatedTarget);
    var postId = getPostIdFromElement(button);

    $.get('/api/posts/' + postId, (results)=>{  
        outputPosts(results, $("#originalPostContainer")); 
    });
});

// Like click
$(document).on("click",".likeButton", (event) => {
    var button = $(event.target);
    var postId = getPostIdFromElement(button);

    if(postId ===  undefined) return;

    $.ajax({
        url: `/api/posts/${postId}/like`,
        type: "PUT",
        success: (postData)=>{

            button.find("span").text(postData.likes.length || ""); // next span element you find
            
            if(postData.likes.includes(userLoggedIn._id)){
                button.addClass("active");
            }
            else{
                button.removeClass("active");
            }

            return postData;
        }
    })
    console.log(postId);

});


// Retweet click
$(document).on("click",".retweetButton", (event) => {
    var button = $(event.target);
    var postId = getPostIdFromElement(button);

    if(postId ===  undefined) return;

    $.ajax({
        url: `/api/posts/${postId}/retweet`,
        type: "POST",
        success: (postData)=>{

            button.find("span").text(postData.retweetUsers.length || ""); // next span element you find
            
            if(postData.retweetUsers.includes(userLoggedIn._id)){
                button.addClass("active");
            }
            else{
                button.removeClass("active");
            }

            return postData;
        }
    })
    console.log(postId);

});



function getPostIdFromElement(element){
    var isRoot = element.hasClass("post");  // it means it is the root element
    var rootElement = isRoot==true ? element : element.closest(".post");
    var postId = rootElement.data().id;

    if(postId === undefined) return alert("Post id undefined");

    return postId;
}

function createPostHtml(postData){

    if(postData == null) return alert("Null");


    // if postData contain retweetData it means it is retweet
    var isRetweet = postData.retweetData !== undefined;
    var retweetedBy = isRetweet ? postData.postedBy.username : null;
    postData = isRetweet ? postData.retweetData : postData;
    
    if(postData.content !== undefined){
        
        arr = postData.content.split(" ");

        for (index = 0; index < arr.length; index++) {
            if(arr[index].startsWith('#')){
                arr[index]= `<span class='link'>${arr[index]}</span>`;
            }          
        }
        
        postData.content = arr.join(' ');
        
    }
    
    
    
    var postedBy = postData.postedBy;

    if(postedBy._id === undefined){
        console.log("User not populated");    
    }

    var displayName = postedBy.firstName + " " + postedBy.lastName;
    var timestamp = timeDifference(new Date(), new Date(postedBy.createdAt));

    var likedButtonActiveCLass = postData.likes.includes(userLoggedIn._id) ? "active" : ""; 
    var retweetButtonActiveCLass = postData.retweetUsers.includes(userLoggedIn._id) ? "active" : ""; 

    var retweetText = '';
    if(isRetweet){
        retweetText = `<span>
            <i class="fa-solid fa-retweet"></i>
            Retweeted by <a href='/profile/${retweetedBy}'>@${retweetedBy}</a>
            </span>`
    }

    if(postedBy.isVerified){
        displayName += `<svg viewBox="0 0 24 24" aria-label="Verified account" id="verified" class="r-1cvl2hr r-4qtqp9 r-yyyyoo r-1xvli5t r-f9ja8p r-og9te1 r-bnwqim r-1plcrui r-lrvibr"><g><path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.818-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.437 2.25c-.415-.165-.866-.25-1.336-.25-2.11 0-3.818 1.79-3.818 4 0 .494.083.964.237 1.4-1.272.65-2.147 2.018-2.147 3.6 0 1.495.782 2.798 1.942 3.486-.02.17-.032.34-.032.514 0 2.21 1.708 4 3.818 4 .47 0 .92-.086 1.335-.25.62 1.334 1.926 2.25 3.437 2.25 1.512 0 2.818-.916 3.437-2.25.415.163.865.248 1.336.248 2.11 0 3.818-1.79 3.818-4 0-.174-.012-.344-.033-.513 1.158-.687 1.943-1.99 1.943-3.484zm-6.616-3.334l-4.334 6.5c-.145.217-.382.334-.625.334-.143 0-.288-.04-.416-.126l-.115-.094-2.415-2.415c-.293-.293-.293-.768 0-1.06s.768-.294 1.06 0l1.77 1.767 3.825-5.74c.23-.345.696-.436 1.04-.207.346.23.44.696.21 1.04z"></path></g></svg>`;
    }
    
    return `<div class="post" data-id='${postData._id}'> 
                <div class="postActionContainer">
                    ${retweetText} 
                </div>
                <div class="mainContentContainer">
                    <div class="userImageContainer">
                        <img src="${postedBy.profilePic}">
                    </div>
                    <div class="postContentContainer">
                        <div class="header">
                            <a href="/profile/${postedBy.username}" class="displayName">@${displayName} </a>
                            <span class="username">${postedBy.username}</span>
                            <span class="date">${timestamp}</span>
                        </div>
                        <div class="postBody">
                        <span>${postData.content}</span>
                        </div>
                        <div class="postFooter">
                            <div class="postButtonContainer">
                                <button data-toggle="modal" data-target="#replyModal">
                                    <i class="fa-regular fa-comment"></i>
                                </button>
                            </div>
                            <div class="postButtonContainer green">
                                <button class="retweetButton ${retweetButtonActiveCLass}">
                                <i class="fa-solid fa-retweet"></i>
                                <span>${postData.retweetUsers.length || ""}</span>
                                </button>
                            </div>
                            <div class="postButtonContainer red">
                                <button class="likeButton ${likedButtonActiveCLass}">
                                    <i class="fa-regular fa-heart"></i>
                                    <span>${postData.likes.length || ""}</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </.div>
    `;
    return postData.content;


}

function timeDifference(current, previous) {

    var msPerMinute = 60 * 1000;
    var msPerHour = msPerMinute * 60;
    var msPerDay = msPerHour * 24;
    var msPerMonth = msPerDay * 30;
    var msPerYear = msPerDay * 365;

    var elapsed = current - previous;

    if (elapsed < msPerMinute) {
         if(elapsed/1000 < 30) return 'just now';    //elapsed/1000 means answer in seconds.
            
         
         return Math.round(elapsed/1000) + ' seconds ago';   
    }

    else if (elapsed < msPerHour) {
         return Math.round(elapsed/msPerMinute) + ' minutes ago';   
    }

    else if (elapsed < msPerDay ) {
         return Math.round(elapsed/msPerHour ) + ' hours ago';   
    }

    else if (elapsed < msPerMonth) {
        return Math.round(elapsed/msPerDay) + ' days ago';   
    }

    else if (elapsed < msPerYear) {
        return Math.round(elapsed/msPerMonth) + ' months ago';   
    }

    else {
        return Math.round(elapsed/msPerYear ) + ' years ago';   
    }
}

function outputPosts(results, container){
    container.html("");

    // if not array
    if(!Array.isArray(results)){
        results = [results];
    }

    results.forEach(result => {                        // displaying tweets 
        var html = createPostHtml(result);          
        container.append(html);
    });

    if(results.length == 0){
        container.append("<span class='noResults'>Nothing to show.</span>");
    }

}