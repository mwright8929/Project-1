var clicked = 0;

$("#searchButton").on("click", function (event) {
    event.preventDefault();
    charityPull();
    populatePage();
    console.log("searchButton");
});

// To add charity info
$("body").on("click", ".charInfo", function (response){
    console.log('clicked')
    if(clicked == 0){
        // Makes charity mission visible
        clicked = 1;
        $(this).children().removeClass('invis');
    } else{
        // Makes charity mission invisible
        clicked = 0;
        $(this).children().addClass('invis');
    };
});


function charityPull() {
    console.log("got into charityPull");
    var searchTerm = $("#search-term").val();
    console.log(searchTerm);
    var key = "811f3796206861ae75e263c9f204ca17";
    var APP_ID = "caa9091c";
    // rated is used to make sure if the charity has been fully verified and rated
    // turn to false if it doesn't matter whether the charity hasn't been verified/rated
    var rated = "true";
    // rating is used to make sure only charities that are ranked 4-starts/4-stars are shown
    var rating = "4";
    var queryURL = "https://api.data.charitynavigator.org/v2/Organizations?app_id=" + APP_ID + "&app_key=" + key + "&search=" + searchTerm + "&rated=" + rated + "&minRating=" + rating;
    console.log(queryURL);
    $.ajax({
        url: queryURL,
        method: "GET",
        dataType: "json",
    }).then(function (response) {
        for (var i = 0; i < 10; i++) {
            var result = response[i];
            console.log("got into then");
            charName = response[i].charityName;
            charAddress = (response[i].mailingAddress.streetAddress1 + "<br>" + response[i].mailingAddress.city + ", " + response[i].mailingAddress.stateOrProvince + "<br>" + response[i].mailingAddress.postalCode);
            console.log(result);
            // console.log(charName);
            // console.log(charAddress);
            $("#contentInformation > tbody").append(
                "<tr>" + 
                    "<td class='tableWidth>" + 
                        "<a href='" + response[i].websiteURL + "'>" + charName + "</a>" + "<br>" + 
                        "<p class='charInfo'>" + response[i].tagLine + "<br><br>" +
                            "<span class='card m-3 card-body invis'>" + response[i].mission + "</span>" + 
                        "</p>" + 
                    "</td> " + 
                    "<td class='charMap' id='charMap'>" + charAddress + "</td>" + 
                "</tr>"
                
            );
            $("#search-term").val("");
        }
    })
        .fail(function (message) {
            console.log("failed!");
            console.log(message);
        });

};

function populatePage() {
    $("#contentInformation").empty();
    newPage = "<div class='card'><div class='card-header'>Charities</div>" +
        // Creates a newly generated table w/ id contentInformation
        "<div class='card-body'><table class='table' id='contentInformation'>" +
        // Establishes the thead as Charity Name and gives a tbody for information
        "<thead><tr><th scope='col'>Name</th><th scope='col' class='charMap'>Address</th></tr></thead><tbody></tbody></table></div></div>";
    $("#contentInformation").html(newPage);
    console.log("populate this!");
};