//TODO Add cards to page after get result
//TODO pagination 25/50/100 results at a time
//TODO add loading visual
//TODO scroll to bottom to update and get more results.
//TODO Card format. title,artist,image,small preview?
$(document).ready(() => {
    $('#updateList').click((e) => {
        e.preventDefault()
        console.log("update clicked")
        $.get("/gethistory", function(data,status){
            console.log(data)
            console.log(status);
        })
    })
})
