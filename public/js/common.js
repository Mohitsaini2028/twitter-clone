$('#PostTextarea').keyup((event)=> {
    var textbox = $(event.target);
    var value = textbox.val().trim();
    
    var submitButton = $('#submitPostButton');

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


function createPostHtml(postData){

    arr = postData.content.split(" ");

    for (index = 0; index < arr.length; index++) {
        if(arr[index].startsWith('#')){
            arr[index]= `<span class='link'>${arr[index]}</span>`;
        }
        
    }

    postData.content = arr.join(' ');

    var postedBy = postData.postedBy;
    var displayName = postedBy.firstName + " " + postedBy.lastName;
    var timestamp = postedBy.createdAt;

    return `<div class="post"> 

                <div class="mainContentContainer">
                    <div class="userImageContainer">
                        <img src="${postedBy.profilePic}">
                    </div>
                    <div class="postContentContainer">
                        <div class="header">
                            <a href="/profile/${postedBy.username}" class="displayName">@${displayName}</a>
                            <span class="username">${postedBy.username}</span>
                            <span class="date">${timestamp}</span>
                        </div>
                        <div class="postBody">
                        <span>${postData.content}</span>
                        </div>
                        <div class="postFooter">
                            <div class="postButtonContainer">
                                <button>
                                    <i class="fa-regular fa-comment"></i>
                                </button>
                            </div>
                            <div class="postButtonContainer">
                                <button>
                                <i class="fa-solid fa-retweet"></i>
                                </button>
                            </div>
                            <div class="postButtonContainer">
                                <button>
                                    <i class="fa-regular fa-heart"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
    `;
    return postData.content;


}