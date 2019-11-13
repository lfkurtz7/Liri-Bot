require("dotenv").config()
var fs = require('fs');
var keys = require("./keys.js")
var axios = require("axios");
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);

var command = process.argv[2];
var search = process.argv.splice(3).join(" ")

RunLiri(command, search)

function RunLiri(c, s) {
  switch (c) {
    case 'spotify-this-song':
      return searchSpotify(s);
    case 'movie-this':
      return searchOMDB(s);
    case 'do-what-it-says':
      return doIt();
  }
}
function doIt() {
  fs.readFile("random.txt", "utf8", function (err, result) {
    if (err) throw err;

    var resArr = result.split(",")
    //console.log(resArr)
    for (var i = 0; i < resArr.length; i++) {
      if (i % 2 === 0) {
        RunLiri(resArr[i], resArr[i + 1])
      }
    }
    // RunLiri(resArr[0], resArr[1])
    // RunLiri(resArr[2], resArr[3])
  })
}
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

function searchBandsInTown(band) {
  var queryUrl = "https://rest.bandsintown.com/artists/" + band + "/events?app_id=codingbootcamp";
  console.log(queryUrl);

  axios.get(queryUrl).then(
    function (artistResponse) {
      //console.log(artistResponse.data)
      console.log("\n\n--------");
      console.log("Venue: " + artistResponse.data[0].venue.name)
      console.log("City: " + artistResponse.data[0].venue.city)
      console.log("Event Date: " + (moment(artistResponse.data[0].datetime)).format("MM/DD/YYYY"));
      console.log("\n\n---------");
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

// //OMDB
// var nodeArgs = process.argv;
// var movieName="";
// for (var i = 2; i < nodeArgs.length; i++) {
//     if (i > 2 && i < nodeArgs.length) {
//         movieName = movieName + "+" + nodeArgs[i];
//     } else {
//         movieName += nodeArgs[i]
//     }
// }

// var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";
// console.log(queryUrl);

// axios.get(queryUrl).then(
//   function(response) {
//     console.log("\n\n--------");
//     console.log("Title: " + response.data.Title);
//     console.log("Release Year: " + response.data.Year);
//     console.log("IMDB Rating: " + response.data.imdbRating);
//     //console.log("Rotten Tomatoes Rating: " + response.data.Ratings.source[0]);
//     console.log("Country: " + response.data.Country);
//     console.log("Language: " + response.data.Language);
//     console.log("Plot: " + response.data.Plot);
//     console.log("Actors: " + response.data.Actors);
//     console.log("\n\n---------");
//   })
//   .catch(function(error) {
//     if (error.response) {
//       console.log("---------------Data---------------");
//       console.log(error.response.data);
//       console.log("---------------Status---------------");
//       console.log(error.response.status);
//       console.log("---------------Status---------------");
//       console.log(error.response.headers);
//     } else if (error.request) {
//       console.log(error.request);
//     } else {
//       console.log("Error", error.message);
//     }
//     console.log(error.config);
//   });

// //bands in town//
// var nodeArgs1 = process.argv;
// var artist="";
// for (var i = 2; i < nodeArgs1.length; i++) {
//     if (i > 2 && i < nodeArgs1.length) {
//         artist = artist + "+" + nodeArgs1[i];
//     } else {
//         artist += nodeArgs1[i]
//     }
// }

// var queryUrl = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";
// console.log(queryUrl);

// axios.get(queryUrl).then(
//   function(response) {
//     console.log(response.data)
//     console.log("\n\n--------");
//     // console.log("Title: " + response.data.Title);
//     // console.log("Release Year: " + response.data.Year);
//     // console.log("IMDB Rating: " + response.data.imdbRating);
//     // //console.log("Rotten Tomatoes Rating: " + response.data.Ratings.source[0]);
//     // console.log("Country: " + response.data.Country);
//     // console.log("Language: " + response.data.Language);
//     // console.log("Plot: " + response.data.Plot);
//     // console.log("Actors: " + response.data.Actors);
//     console.log("\n\n---------");
//   })
//   .catch(function(error) {
//     if (error.response) {
//       console.log("---------------Data---------------");
//       console.log(error.response.data);
//       console.log("---------------Status---------------");
//       console.log(error.response.status);
//       console.log("---------------Status---------------");
//       console.log(error.response.headers);
//     } else if (error.request) {
//       console.log(error.request);
//     } else {
//       console.log("Error", error.message);
//     }
//     console.log(error.config);
//   });