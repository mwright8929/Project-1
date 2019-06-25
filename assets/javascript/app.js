$("#searchButton").on("click", async function (event) {
    event.preventDefault();
    var returnAddresses = [];
    var returnedGeocodes = [];
    // Return promise
    // returnAddresses = await charityPull().then(function(res) {
    //     console.log('My response',res)
    //     returnedGeocodes = await geocode(res);
    //     console.log('IM RETURNED',returnedGeocodes);
    // })
    populatePage();
    returnAddresses = await charityPull()
    console.log('Address')
    returnedGeocodes = await geocode(returnAddresses);
    console.log("Geocode");
    
    // returnedGeocodes = geocode(returnAddresses).then(function(res) {
    //     console.log('The Geocodes: ',res)

    // });

    console.log(returnedGeocodes);
    // console.log("searchButton");
    
    drawMap(returnedGeocodes);
  
});

$("#charInfo").on("click", function (){
    console.log("charInfo");
    $("#contentInformation > tbody").append("<div class='card m-3'><div class='card-body'>" + response[i].mission + "</div></div>");
});

function charityPull() {
    //console.log("got into charityPull");
    var searchTerm = $("#search-term").val();
    var pullAddresses =[];
    //console.log(searchTerm);
    var key = "811f3796206861ae75e263c9f204ca17";
    var APP_ID = "caa9091c";
    // rated is used to make sure if the charity has been fully verified and rated
    // turn to false if it doesn't matter whether the charity hasn't been verified/rated
    var rated = "true";
    // rating is used to make sure only charities that are ranked 4-starts/4-stars are shown
    var rating = "4";
    var queryURL = "https://api.data.charitynavigator.org/v2/Organizations?app_id=" + APP_ID + "&app_key=" + key + "&search=" + searchTerm + "&rated=" + rated + "&minRating=" + rating;
    //console.log(queryURL);
    return $.ajax({
        url: queryURL,
        method: "GET",
        dataType: "json",
    }).then(function (response) {
        for (var i = 0; i < 10; i++) {
            var result = response[i];
            //console.log("got into then");
            charName = response[i].charityName;
            charAddress = (response[i].mailingAddress.streetAddress1 + ", " + response[i].mailingAddress.city + ", " + response[i].mailingAddress.stateOrProvince + ", " + response[i].mailingAddress.postalCode);
            pullAddresses.push(charAddress);
            // console.log("test thisss " + pullAddresses);
            //console.log(result);
            // console.log(charName);
            // console.log(charAddress);
            $("#contentInformation > tbody").append("<tr><td id='charInfo'><a href='" + response[i].websiteURL + "'>" + charName + "</a><br><p>" + response[i].tagLine + "</p></td><td id='charMap'>" + charAddress + "</td>")
            $("#search-term").val("");
        }
        // console.log("test thisss " + pullAddresses);
        return pullAddresses;
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
        "<thead><tr><th scope='col'>Name</th><th scope='col'>Address</th></tr></thead><tbody></tbody></table></div></div>";
    $("#contentInformation").html(newPage);
    console.log("populate this!");
};

async function geocode(rxAddresses){
    console.log('addys',rxAddresses)
       var pullGeocodes = [];
       //var addressGeocode = null;
       var api_key = 'ee0a05710dd5c51e4a51d0457cdefa055075405';

       // Make for loop synchronous
       var i=0;

       while (i<rxAddresses.length) {
       //for (i=0; i<rxAddresses.length; i++) {
        const res = await  $.ajax({
            url: 'https://api.geocod.io/v1.3/geocode?q='+rxAddresses[i]+'&api_key='+api_key,
            method: "GET",
            dataType: "json",
        });
        pullGeocodes.push({0:res.results[0].location.lat, 1:res.results[0].location.lng});
        i++;
            // console.log('MY RES', res);
        //})
        // pullGeocodes.push({0:jsonObj.results[0].location.lat[i], 1:jsonObj.results[0].location.lat[i]});
    }
    return pullGeocodes;
};

function drawMap(rxGeocodes) {
    var mapboxKey = "pk.eyJ1Ijoid2JlcnJpbmciLCJhIjoiY2p3endsODB1MGpnMDQ5czgwM2hwczh3NiJ9.Bx-jeamSp03diPGM5dCGZg";

    var mymap = L.map('mapid').setView([39.8283, -98.5795], 3);

    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox.streets',
    accessToken: mapboxKey
}).addTo(mymap);

for (var i = 0; i < rxGeocodes.length; i++){
    var lat = rxGeocodes[i][0];
    var lon = rxGeocodes[i][1];
    var marker = L.marker([lat, lon]).addTo(mymap);

}


};