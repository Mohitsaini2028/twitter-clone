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
        // content: textbox.val()
    }

    $.post("/api/posts", data, (postData, status, xhr)=>{
        alert(postData);
    })
});