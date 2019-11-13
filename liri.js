require("dotenv").config()
var fs = require('fs');
var keys = require("./keys.js")
var axios = require("axios");
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);
var moment = require("moment");

var command = process.argv[2];
var search = process.argv.splice(3).join(" ")

RunLiri(command, search)

function RunLiri(c, s) {
  switch (c) {
    case 'spotify-this-song':
      return searchSpotify(s);
    case 'movie-this':
      return searchOMDB(s); 
    case 'concert-this':
      return searchBandsInTown(s);
    case 'do-what-it-says':
      return doIt();
  }
}
function doIt() {
  fs.readFile("random.txt", "utf8", function (err, result) {
    if (err) throw err;

    var resArr = result.split(",")
    for (var i = 0; i < resArr.length; i++) {
      if (i % 2 === 0) {
        RunLiri(resArr[i], resArr[i + 1])
      }
    }
   
  })
}

// Spotify search
function searchSpotify(song) {
  console.log("Searching Spotify for %s", song)

  if (!song) {
    song = "The Sign Ace of Base"
  }

  spotify.search({ type: 'track', query: song }, function (err, data) {
    if (err) {
      return console.log('Error occurred: ' + err);
    }
    
    console.log("\n\n------------\n\n");

    console.log("Track: " + data.tracks.items[0].name);
    console.log("Artist: " + data.tracks.items[0].artists[0].name);
    console.log("Album Title: " + data.tracks.items[0].album.name);

    if(data.tracks.items[0].preview_URL === null || data.tracks.items[0].preview_URL === undefined) {
      console.log( "No preview for " + data.tracks.items[0].name + " available from Spotify")
    } else {
      console.log("Track Preview: " + data.tracks.items[0].preview_URL);
    }
    console.log("\n\n------------");
   
  })
  

}
// Bands In Town search
function searchBandsInTown(band) {
  var queryUrl = "https://rest.bandsintown.com/artists/" + band + "/events?app_id=codingbootcamp";
  console.log(queryUrl);

  axios.get(queryUrl).then(
    function (artistResponse) {
      console.log("\n\n-----------\n\n");
      if(artistResponse.data[0] === null || artistResponse.data[0] === undefined) {
        console.log("No upcoming concerts for " + band)
      } else {
      console.log("Venue: " + artistResponse.data[0].venue.name)
      console.log("Location: " + artistResponse.data[0].venue.city +" , " + artistResponse.data[0].venue.region + " , " +artistResponse.data[0].venue.country);
      console.log("Event Date: " + (moment(artistResponse.data[0].datetime)).format("MM/DD/YYYY"));
      console.log("\n\n---------------\n\n"); }
    })

    .catch(function (error) {
      if (error.artistResponse) {
        console.log("---------------Data---------------");
        console.log(error.artistResponse.data);
        console.log("---------------Status---------------");
        console.log(error.artistResponse.status);
        console.log("---------------Status---------------");
        console.log(error.artistResponse.headers);
      } else if (error.request) {
        console.log(error.request);
      } else {
        console.log("Error", error.message);
      }
      console.log(error.config);
    });
} 

//OMDB search
function searchOMDB(movie) {
  console.log("Searching OMDB for %s", movie)
  var queryUrl = "http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=trilogy";

  axios.get(queryUrl)
    .then(function (response) {
      console.log(new ShowData(response.data))
    })
    .catch(function (error) {
      if (error.response) {
        console.log("---------------Data---------------");
        console.log(error.response.data);
        console.log("---------------Status---------------");
        console.log(error.response.status);
        console.log("---------------Status---------------");
        console.log(error.response.headers);
      } else if (error.request) {
        console.log(error.request);
      } else {
        console.log("Error", error.message);
      }
      console.log(error.config);
    });

}
function ShowData(jsonData) {
  this.Title = jsonData.Title;
  this.Release_Year = jsonData.Year;
  this.IMDB_rating = jsonData.imdbRating;
  this.Country = jsonData.Country;
  this.Language = jsonData.Language;
  this.Plot = jsonData.Plot;
  this.Actors = jsonData.Actors
}

