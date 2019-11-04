//////////////////////// GLOBALS ////////////////////////
//var publicKey = config.MY_KEY; //for private config file.
//var privateKey = config.SECRET_KEY; //for private config file.
var publicKey = '4d1d2b3e23717927e1ae35fb9dedb99b'; // Public Key 
var privateKey = 'f6011be74e9e0d6f79eed5a0ee24491ed5265146'; // Private Key 
var ts = new Date().getTime(); // Generating date/time
var hash = CryptoJS.MD5(ts + privateKey + publicKey).toString(); // Hashing with MD5 (js link), a combination of private and public key and time stamp in order for us to be able to correctly use the Marvel API key. 

var d = new Date(); // Date
var y = d.getFullYear(); // Year only retrieved from d variable


var searchSelect; //Declaring global variable to use later on in code. searchSelect will be used in a switch case to determine what HTTP request to send to a single ajax; for example whether to send the characters HTTP URL or the year the user selected. It will also be used to toggle a hide/show of the years listing. 

////////////////////////////////////////////////////////////

/////////////////// REGISTERED HELPERS ////////////////
HandlebarsIntl.registerWith(Handlebars);
///////////////////////////////////////////////////////


////////////////// CLICK EVENT - STORE RADIO BUTTON SELECTED - SHOW/HIDE YEARS  //////////////////
$(".comic__search--list").on("click", "li", function() { 
  // CLICK Event, with added event delegation for list items. There are two list items. 

  searchSelect = $(this).children().val(); // For (this) list item, find the children of this list item,  (input and label), and find the VAL (value of the input).

  //Toggle the hide/show of the years options 1990 - 2019 
  if (searchSelect === "years") {
    $(".years__options").show();
  } else if (searchSelect === "characters") {
    $(".years__options").hide();
  }
});
////////////////////////////////////////////////////////////

////////////////// HIDE NON-DYNAMIC SEARCH HEADER/FOOTER PRE-SEARCH SUBMIT //////////////////

$(".search")
  .children()
  .children(".primary__heading")
  .hide();

$(".search")
  .find(".search__results--end")
  .hide();

////////////////////////////////////////////////////////////

///////////////// SEARCH FUNCTION  ////////////////////////////

$(".comic__search").on("submit", function(e) { 
  // ON SUBMIT
  e.preventDefault(); // Prevent default submit action/behaviour

 $('.comic__search--list').find('input').prop('checked', false);//Find all inputs that have been clicked and deselect them on submit so its a blank start when they go to search again (no checked boxes)

 $('.character__card__one').remove(); // Remove pre-existing content from the page so that we can add the new search content 
  
    var url; //Declaring 
    var yearChoice = $(".years__options").val(); 
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
  var  yearURL =
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

    //AJAX fetch
    $.ajax({
      type: "GET",
      url: url,
      success: function(responseSearch) {
        $(".search__results__template__ul")
          .children()
          .remove(".loading");

        $(".search__results--end").show();
        $(".search")
          .children()
          .children(".primary__heading")
          .show();
        console.log(responseSearch);

        $(".characters").remove();
        $(".new__comics").remove();
        $(".randomize").remove();

        ////////////// SEARCH ///////////////
        var source = $("#search__results__template__script").html();
        var template = Handlebars.compile(source);
        var searchData = responseSearch.data.results;
        var displayData = template(searchData);
        $(".search__results__template__ul").append(displayData);
      },
      beforeSend: function() {
        $(".search__results__template__ul").prepend(
          '<div class="loading"><img src="assets/img/ajax-loader.gif" alt="Loading" /></div>'
        );
      },

      error: function() {
        alert("There was an error getting marvel data.");
      }
    });
  
});

////////////////////////////////////////////////////////////


//////////SEARCH BUTTON SCROLL TO TOP ////////////
$('.search__links').on('click',  '#searchScroll', function(e){
  e.preventDefault();
  $('html, body').animate({
    scrollTop: ($('.nav__section').offset().top)
  },1000);
  })
  ////////////////////////////////////////////////////////////

//////////// SINGLE CHARACTERS  AJAX ////////////
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
    $(".character__template__hb")
      .children()
      .remove(".loading");
    ////////////// CHARACTERS ///////////////
    var source = $("#character__template").html();
    var template = Handlebars.compile(source);
    var characterData = response.data.results;
    var hayArrayObj = [
      characterData[15],
      characterData[6],
      characterData[13],
      //characterData[5],
      characterData[17],
      characterData[3]
    ];
    var displayData = template(hayArrayObj);
    $(".character__template__hb").append(displayData);
  },

  beforeSend: function() {
    $(".character__template__hb").prepend(
      '<div class="loading"><img src="assets/img/ajax-loader.gif" alt="Loading" /></div>'
    );
  },

  error: function() {
    alert("There was an error getting marvel data.");
  }
});
////////////////////////////////////////////////////////////

////////////// MONTH AND WEEK COMICS  ///////////////

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
      $(".comic__listings")
        .children()
        .remove(".loading");

      var source = $("#comic__book__template").html();
      var template = Handlebars.compile(source);
      var comicData = responseComics.data.results;
      var displayData = template(comicData);
      $(".comic__listings").append(displayData);
    },

    beforeSend: function() {
      $(".comic__listings").prepend(
        '<div class="loading"><img src="assets/img/ajax-loader.gif" alt="Loading" /></div>'
      );
    },

    error: function() {
      alert("There was an error getting marvel data.");
    }
  });
}
////////////////////////////////////////////////////////////

///////////////////////////// FOR WHEN PAGE LOADS////////////////////////////////////

if ($("#week__new").is(":checked")) {
  $(".character__card").empty();
  callComicDates("thisWeek");
} else if ($("#month__new").is(":checked")) {
  $(".character__card").empty();
  callComicDates("thisMonth");
}

////////////////////////////////////////////////////////////

////////////////////// FOR WHEN TAB CLICKED ////////////////////////////
$(".new__comics--ulist").on("click", function(e) {
  if ($(e.target).is("#week__new")) {
    $(".character__card").remove();
    callComicDates("thisWeek");
  } else if ($(e.target).is("#month__new")) {
    $(".character__card").remove();
    callComicDates("thisMonth");
  }
});
////////////////////////////////////////////////////////////

///////////// RANDOM COMIC OF 2019 ///////////

$(".randomize")
  .find("h1")
  .html("Spider Issues of " + y);

function randomizeSpider() {
  var todayIssue =
    "https://gateway.marvel.com:443/v1/public/comics?format=comic&formatType=comic&noVariants=false&dateRange=" +
    y +
    "-01-01%2C" +
    y +
    "-12-31&title=The%20Amazing%20Spider-Man&orderBy=title&limit=99&apikey=4d1d2b3e23717927e1ae35fb9dedb99b";

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
      var randomNumber = Math.floor(Math.random() * todayIssueLength);
      var source = $("#comic__book__randomize__template").html();
      var template = Handlebars.compile(source);
      var randomIssueIs = todayIssue.data.results[randomNumber];
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

randomizeSpider();

$(".randomize__again").on("submit", function(e) {
  e.preventDefault();

  $(this)
    .find(".randomize__comic__whole")
    .remove();

  randomizeSpider();
});

////////////////////////////////////////////////////////////

///////////////////////  FOOTER //////////////////////////

$(".footer__area")
  .children(".footer__area__marvel")
  .html("Data provided by Marvel. © " + y + " Marvel");

////////////////////////////////////////////////////////////

