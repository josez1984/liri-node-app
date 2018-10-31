require("dotenv").config();
var request = require('request');
var moment = require('moment');
var Spotify = require('node-spotify-api');
var keys = require('./keys.js');
var fs = require('fs');

module.exports = {
    'concert-this': function(artist){        
            request("https://rest.bandsintown.com/artists/" + artist + "/events?app_id=" + keys.bandsInTown, function(error, response, body) {        
            if (!error && response.statusCode === 200 && body) {  
                var data = JSON.parse(body);     
                for(var i = 0; i < data.length; i++) {
                    console.log(data[i].venue.name);
                    console.log(data[i].venue.city + ', ' + data[i].venue.region);                    
                    console.log(moment(data[i].datetime).format("MM/DD/YYYY"));
                    console.log("\n");
                }
            } else {
                console.log("Try again.");
            }
        });
    },
    'spotify-this-song': function(song){    
        var spotify = new Spotify(keys.spotify);
        if(!song) { song = 'the sign ace of base'; }

        spotify.search({ type: 'track', query: song, limit: 1 }, function(err, data) {
            if (err) {
                return console.log('Error occurred: ' + err);
            }            
            for(var i = 0; i < data.tracks.items.length; i++) {                                
                var artistString = '';
                for(var x = 0; x < data.tracks.items[i].artists.length; x++) {
                    artistString = artistString + data.tracks.items[i].artists[x].name + ', ';
                }                                
                console.log("Artist(s): " + artistString);                
                console.log("Song Name: " + song);
                console.log("Album: " + data.tracks.items[i].album.name);
                console.log("Preview Link: " + data.tracks.items[i].album.external_urls.spotify);
                
            }
        });
    },
    'movie-this': function(movieName){        
        if(!movieName) {
            movieName = 'mr-nobody';
        }        
        var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";
        request(queryUrl, function(error, response, body) {
            if (!error && response.statusCode === 200) {                
                body = JSON.parse(body);
                console.log("Title: " + body.Title);
                console.log("Year: " + body.Year);
                console.log("IMDB Rating: " + body.Ratings[0].Value);
                console.log("Rotten Tomatoes Rating: " + body.Ratings[1].Value);
                console.log("Country Produced: " + body.Country);
                console.log("Language: " + body.Language);
                console.log("Plot: " + body.Plot);
                console.log("Actors: " + body.Actors);
            }
        });
    }, 
    'do-what-it-says': function(){                
        var parentObj = this;
        fs.readFile("random.txt", "utf8", function(error, data) {
            if (error) {
                return console.log(error);
            }
            var dataArr = data.split(",");
            parentObj[dataArr[0]](dataArr[1]);
        });        
    }
}
