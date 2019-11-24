//////////////////////// KEYS ////////////////////////
var publicKey = '4d1d2b3e23717927e1ae35fb9dedb99b'; // Public Key 
var privateKey = 'f6011be74e9e0d6f79eed5a0ee24491ed5265146'; // Private Key 
//var publicKey = config.MY_KEY; //for private config file.
//var privateKey = config.SECRET_KEY; //for private config file.
/////////////////////////////////////////////////////////




//////////////////////// DATE TIME AND HASH MD5 ////////////////////////
var ts = new Date().getTime(); // Generating date/time
var hash = CryptoJS.MD5(ts + privateKey + publicKey).toString(); // Hashing with MD5 (js link), a combination of private and public key and time stamp in order for us to be able to correctly use the Marvel API key. 
var d = new Date(); // Date
var y = d.getFullYear(); // Year only retrieved from d variable
///////////////////////////////////////////////////////////////////////




//////////////////////// GLOBALS ////////////////////////
var searchSelect; //Declaring global variable to use later on in code. searchSelect will be used in a switch case to determine what HTTP request to send to a single ajax; for example whether to send the characters HTTP URL or the year the user selected. It will also be used to toggle a hide/show of the years listing. 
/////////////////////////////////////////////////////////





/////////////////// REGISTERED HELPERS ////////////////
HandlebarsIntl.registerWith(Handlebars);
///////////////////////////////////////////////////////


randomizeSpider(); //calling function on page load 

///////////////////////////////////////////////////////// SEARCH SECTION  /////////////////////////////////////////////////////////








//////////////////////// HIDE NON-DYNAMIC SEARCH CONTENT HEADER/CTAS  ////////////////////////
$(".search__results")
  .children()
  .children(".primary__heading")
  .hide();

$(".search__results")
  .find(".search__results__end")
  .hide();
////////////////////////////////////////////////////////////////////////////////////////////////






////////////////// CLICK EVENT - STORE RADIO BUTTON SELECTED VALUE INTO VAR - SHOW/HIDE YEARS  //////////////////
$(".search__area__list").on("click", "li", function() { 
  // CLICK Event, with added event delegation for list items. There are two list items. 
  searchSelect = $(this).children().val(); // For (this) list item, find the children of this list item,  (input and label), and find the VAL (value of the input).
  //Toggle the hide/show of the years options 1990 - 2019 
  if (searchSelect === "years") {
    $(".search__area__years__options").show('fast');
  } else if (searchSelect === "characters") {
    $(".search__area__years__options").hide('fast');
  }

});
/////////////////////////////////////////////////////////////////////////////////////////////













////////////////////////////////// SEARCH FUNCTION SUBMIT   ///////////////////////////////////////////

$(".search__area__form").on("submit", function(e) {
  // ON SUBMIT
  e.preventDefault(); // Prevent default submit action/behaviour
  $(".search__area__list")
    .find("input")
    .prop("checked", false); //Find all inputs that have been clicked and deselect them on submit so its a blank start when they go to search again (no checked boxes)
  $(".characters__cards").remove(); // Remove pre-existing content from the page so that we can add the new search content
  var url; //Declaring
  var yearChoice = $(".search__area__years__options").val();
 
  $(".characters").remove(); //Remove homepage content to make way for search result content
  $(".comics").remove(); //Remove homepage content to make way for search result content
  $(".randomize").remove(); //Remove homepage content to make way for search result content
  
  // Store year chosen from dropdown toggle in variable for later use on submit
  //Setting character HTTP request link
  var characterURL =
    "https://gateway.marvel.com:443/v1/public/characters?nameStartsWith=Spider-&orderBy=-name&limit=10" +
    "&ts=" +
    ts +
    "&apikey=" +
    publicKey +
    "&hash=" +
    hash;
  //Setting year HTTP request link from user input
  var yearURL =
    "https://gateway.marvel.com:443/v1/public/comics?format=comic&formatType=comic&noVariants=true&dateRange=" +
    yearChoice +
    "-01-01%2C%20" +
    yearChoice +
    "-12-31&characters=1009610%2C1014873%2C1017603%2C1016181%2C1011347%2C1010727%2C1012200%2C1011197%2C1012295%2C1009609&limit=10" +
    "&ts=" +
    ts +
    "&apikey=" +
    publicKey +
    "&hash=" +
    hash;
  
    ////////////////////////////////// SWITCH CASE SUBMIT  ///////////////////////////////////////////
  //Switch case taking the searchSelect variable parameter. If this is equal to characters case, set the url variable to characterURL, if it's years, set it to yearURL. If undefined, go to default as characterURL HTTP link request. This checks on SUBMIT (this is in the submit function) as by this point the user has settled on a decision.
  switch (searchSelect) {
    case "characters":
      url = characterURL;
      break;
    case "years":
      url = yearURL;
      break;
    case undefined:
      url = characterURL;
      break;
    default:
      alert("Select an option, Characters or Year");
  }
 
  ////////////////////////////////// AJAX SEARCH REQUEST SUBMIT ///////////////////////////////////////////
  $.ajax({
    type: "GET",
    url: url, //URL will correspond to the characterURL or yearURL dependent on user selection.
    success: function(responseSearch) {
      $(".search__results__template__ul")
        .children()
        .remove(".loading"); //On successful retrieval of data, remove the loading class (spinny)

      $(".search__results__end").show(); // Show class which will contain static HTML content for the search (ie links, headers)
      $(".search__results")
        .children()
        .children(".primary__heading")
        .show(); // Show class which will contain static HTML content for the search (ie links, headers)
      console.log(responseSearch);

  ////////////////////////////////// HANDLEBARS TEMPLATE ONSUBMIT ///////////////////////////////////////////
      var source = $("#search__results__template__script").html(); //Retrieve script ID area of HTML
      var template = Handlebars.compile(source); //Compile this into template via handlebars
      var searchData = responseSearch.data.results; //Set starting point for responseSearch data (search data from api)
      var displayData = template(searchData); // Template this data
      $(".search__results__template__ul").append(displayData); //Append this data to the UL of the script ID to appropriately place content in each place. I.e {{name}} in html to correspond to name property in responseSearch(API data)
    },
    beforeSend: function() {
      //Before send, prepend  the loading disc
      $(".search__results__template__ul").prepend(
        '<div class="loading"><img src="assets/img/ajax-loader.gif" alt="Loading" /></div>'
      );
    },
    error: function() {
      //Error function
      alert("There was an error getting marvel data.");
    }
  });
});


/////////////////////////////////////////////////////////////////////////////////////////////////////












////////////////////////////////// SCROLL TO TOP SEARCH ///////////////////////////////////////////
$('.search__results__links').on('click', '#search__results__scroll', function (e) {
  //On click of this button - event delegation as it is initially hidden, so #searchScroll.
  e.preventDefault(); //Prevent default behaviour
  // Select HTML and body, animate the scroll within the html/body to scrollTop, to the nav section by class .nav__section. 1000 is anim speed. 
  $('html, body').animate({
    scrollTop: ($('.nav__section').offset().top)
  }, 1000);
});
//////////////////////////////////////////////////////////////////////////////////////////////////












///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////









///////////////////////////////////////////////////////// SINGLE CHARACTER SECTION  /////////////////////////////////////////////////////////
//AJAX request as before. 
$.ajax({
  type: "GET",
  url:
    "https://gateway.marvel.com:443/v1/public/characters?nameStartsWith=Spider-&orderBy=-name&limit=100" +
    "&ts=" +
    ts +
    "&apikey=" +
    publicKey +
    "&hash=" +
    hash,
  success: function(response) {
    console.log(response);
    $(".characters__template__ul").children().remove(".loading");
    var source = $("#characters__template").html();
    var template = Handlebars.compile(source);
    var characterData = response.data.results;
    //All of the above follows the same procedure with the HTTP request and Handlebars templating as the search result above. However, this time, the URL request is fetching a specific search of Spider-Man characters. I then create an array which I place the chosen characters (objects) into this array from the http request results. Then in the HTML script for the handlebars section, a handlebar helper is used to loop through each object in this array. FOR EACH - display {{name}}, so on and so forth
    var hayArrayObj = [
      characterData[15],
      characterData[6],
      characterData[13],
      characterData[17],
      characterData[3]
    ];
    var displayData = template(hayArrayObj);
    $(".characters__template__ul").append(displayData);
    console.log(hayArrayObj);
  },

  beforeSend: function() {
    $(".characters__template__ul").prepend(
      '<div class="loading"><img src="assets/img/ajax-loader.gif" alt="Loading" /></div>'
    );
  },

  error: function() {
    alert("There was an error getting marvel data.");
  }
});
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



















///////////////////////////////////////////////////////// MONTH AND WEEK COMIC SECTION /////////////////////////////////////////////////////////

///////FUNCTION FOR MONTH AND WEEK TAB//////////
//This function takes a parameter, called paramDate. This parameter is parsed into the AJAX request for the URL at a specific point to change the HTTP URL request from 'thisweek' to 'thismonth' or vice versa to display a different result.
//The remainder of this function is the same as previous AJAX requests
function callComicDates(paramDate) {
  $.ajax({
    type: "GET",
    url:
      "https://gateway.marvel.com:443/v1/public/comics?format=comic&formatType=comic&noVariants=false&dateDescriptor=" +
      paramDate +
      "&characters=1009610%2C1014873%2C1017603%2C1016181%2C1011347%2C1010727%2C1012200%2C1011197%2C1012295%2C1009609&orderBy=onsaleDate" +
      "&ts=" +
      ts +
      "&apikey=" +
      publicKey +
      "&hash=" +
      hash,
    success: function(responseComics) {
      $(".comics__listings")
        .children()
        .remove(".loading");

      var source = $("#comic__book__template").html();
      var template = Handlebars.compile(source);
      var comicData = responseComics.data.results;
      var displayData = template(comicData);
      $(".comics__listings").append(displayData);
    },

    beforeSend: function() {
      $(".comics__listings").prepend(
        '<div class="loading"><img src="assets/img/ajax-loader.gif" alt="Loading" /></div>'
      );
    },

    error: function() {
      alert("There was an error getting marvel data.");
    }
  });
}

///////////////// MONTH AND WEEK FUNCTION CALL ON PAGE LOAD AND IF CHECK //////////////
//On initial load of page - check to see which toggle is checked - new week or new month. By default you have added html to make week 'checked'. But this is to say whatever is checked, to empty the content and run the function call again. 
if ($("#week__new").is(":checked")) {
  $(".comics__card").empty();
  callComicDates("thisWeek");
} else if ($("#month__new").is(":checked")) {
  $(".characters__cards").empty();
  callComicDates("thisMonth");
}

//////////////// CLICK FUNCTION FOR MONTH AND WEEK USER INTERACTION ///////////////////////////////
//Above was for initial load of the page, this is for user interaction. On click, if event target is week__new ID, remove character card and recall function for thisweek as the parameter, vice versa. 
$(".comics__tab").on("click", function(e) {
  if ($(e.target).is("#week__new")) {
    $(".comics__cards").remove();
    callComicDates("thisWeek");
  } else if ($(e.target).is("#month__new")) {
    $(".comics__cards").remove();
    callComicDates("thisMonth");
  }
});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////









//////////////////////////////////////////////// RANDOMIZE COMIC /////////////////////////////////////////////////////////////////////////////


////////// UPDATING HEADING DYNAMICALLY FOR YEAR /////
$(".randomize")
  .find("h1")
  .html("Spider Issues of " + y); // y being dynamic year date. 


////////// RANDOMIZE FUNCTION  ////////////
function randomizeSpider() {
  //todayIssue storing http request url for the current year. 


    //AJAX request is same as previous apart from the randomization features commented below. 
  $.ajax({
    type: "GET",
   
    url:
      "https://gateway.marvel.com:443/v1/public/comics?format=comic&formatType=comic&noVariants=false&dateRange=" +
      y +
      "-01-01%2C" +
      y +
      "-12-31&title=The%20Amazing%20Spider-Man&orderBy=title&limit=99" +
      "&ts=" +
      ts +
      "&apikey=" +
      publicKey +
      "&hash=" +
      hash,
    success: function(todayIssue) {
      $(".randomize__ul")
        .children()
        .remove(".loading");

      var todayIssueLength = todayIssue.data.results.length;
      var randomNumber = Math.floor(Math.random() * todayIssueLength); //taking the length of results array from the ajax request and randomizing it to a whole number. That number will correspond to an object in the array which contains a comic issue of 2019. 
      var source = $("#comic__book__randomize__template").html();
      var template = Handlebars.compile(source);
      var randomIssueIs = todayIssue.data.results[randomNumber];//placing randomized number of array length into the ajax request to pick that comic object in the array via this random number [randomnumber]
      var characterData = randomIssueIs;
      var displayData = template(characterData);
      $(".randomize__ul").append(displayData);

        console.log(randomIssueIs);
    },
    beforeSend: function() {
      $(".randomize__ul").prepend(
        '<div class="loading"><img src="assets/img/ajax-loader.gif" alt="Loading" /></div>'
      );
    },
    error: function() {
      alert("There was an error getting marvel data.");
    }
  });
}




/////////////////// USER INTERACTION CLICK TO RANDOMIZE AGAIN ////////////////////////////////

$(".randomize").on("click", function(e) {
  e.preventDefault();
//On submit, find (this) whole comic section and remove it, and re-call the function. 
console.log('clickity click'); 
$(this)
    .find(".randomize__comic__whole")
    .remove();

  randomizeSpider();
});




///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////





///////////////////////////////////////////////////// FOOTER ///////////////////////////////////////////////////////////////////////////////////

//Dynamic footer 
$(".footer__area")
  .children(".footer__area__marvel")
  .html("Data provided by Marvel. © " + y + " Marvel");

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

