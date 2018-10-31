require("dotenv").config();
var spotifyConfig = require('./keys.js');
var actions = require('./actions.js');
var inquirer = require('inquirer');
var request = require('request');

var arg1 = process.argv[2];
console.log("Hi " + arg1);

function validateInput(value) {
  if(value) {
    return true;
  }
  return 'Please enter a value';
}

inquirer.prompt([{
      type: "list",
      message: "Please choose an action.",
      choices: ["concert-this", "spotify-this-song", "movie-this", "do-what-it-says"],
      name: "action"
    }]).then(function(inquirerResponse) {
      if(inquirerResponse.action === 'do-what-it-says') {
        actions[inquirerResponse.action]();        
      } else {
        var options = {};   
        if(inquirerResponse.action === 'concert-this') {
          options = {
            type: "input",
            message: "Artist/Band",
            name: "value",
            validate: function(value) {
              return validateInput(value);
            }
          };
        } else if(inquirerResponse.action === 'spotify-this-song') {
          options = {
            type: "input",
            message: "Song",
            name: "value"
          };
        } else if(inquirerResponse.action === 'movie-this') {
          options = {
            type: "input",
            message: "Movie",
            name: "value"
          };
        }
          inquirer.prompt([options]).then(function(secondResponse){
          actions[inquirerResponse.action](secondResponse.value);
        });
      }
  });
