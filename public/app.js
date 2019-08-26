// Grab the articles as a json on 'scrape new articles' button click
$(".scrape-new").click(function() {
    alert ("Articles Scraped!");
    //empty articles container
    $(".article-container").empty();
    $.getJSON("/articles", function (data) {
    // For each one
    for (var i = 0; i < data.length; i++) {
        // Display the article information on the page
        var articleCard = $("<div>");
        articleCard.addClass("card-header")
        var articleInfo = $("<a>")
        articleInfo.text(data[i].title)
        articleInfo.attr("href", "https://www.nytimes.com" + data[i].link)
        var articleSummary = $("<p>");
        articleSummary.text(data[i].summary);
        articleCard.append(articleInfo, articleSummary);
       // ("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "</p>");
        var saveArticle = $("<btn>");
        saveArticle.addClass("btn btn-success save")
        saveArticle.text("Save Article");
        $(".article-container").append(articleCard, saveArticle);

    }
});
});

//code from activity 18.20 to add a note when the article is clicked - will need to modify for when the 'article notes' button is clicked
// Whenever someone clicks a p tag
$(".save").click(function() {   // Empty the notes from the note section
    $("#notes").empty();
    // Save the id
    var thisId = $(this).attr("data-id");

    // Now make an ajax call for the Article
    $.ajax({
        method: "GET",
        url: "/articles/" + thisId
    })
        // With that done, add the note information to the page
        .then(function (data) {
            console.log(data);
            // The title of the article
            $("#notes").append("<h2>" + data.title + "</h2>");
            // An input to enter a new title
            $("#notes").append("<input id='titleinput' name='title' >");
            // A textarea to add a new note body
            $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
            // A button to submit a new note, with the id of the article saved to it
            $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");

            // If there's a note in the article
            if (data.note) {
                // Place the title of the note in the title input
                $("#titleinput").val(data.note.title);
                // Place the body of the note in the body textarea
                $("#bodyinput").val(data.note.body);
            }
        });
});

// When you click the savenote button
$(document).on("click", "#savenote", function () {
    // Grab the id associated with the article from the submit button
    var thisId = $(this).attr("data-id");

    // Run a POST request to change the note, using what's entered in the inputs
    $.ajax({
        method: "POST",
        url: "/articles/" + thisId,
        data: {
            // Value taken from title input
            title: $("#titleinput").val(),
            // Value taken from note textarea
            body: $("#bodyinput").val()
        }
    })
        // With that done
        .then(function (data) {
            // Log the response
            console.log(data);
            // Empty the notes section
            $("#notes").empty();
        });

    // Also, remove the values entered in the input and textarea for note entry
    $("#titleinput").val("");
    $("#bodyinput").val("");
});
