/*Require secret keys masked in .env file*/
require("dotenv").config();


/*Set require request variable*/
var request = require("request");

/*Require moment variable*/
const moment = require("moment");
const axios = require("axios");

/*Set file system variable to require file systems*/
const fs = require("fs");

/*Set link to key.js file as a variable that will be called async*/
const keys = require("./keys.js");

/*Init Spotify*/
const Spotify = require("node-spotify-api");
const spotify = new Spotify(keys.spotify);

/*Bands in town and internet movie database*/
var bandsInTown = (keys.BandsInTown);
var omdb = (keys.omdb);


/*user input and logger*/
var userInput = process.argv[2];
var userQuery = process.argv.slice(3).join("");

/*LIRI functions*/
function userCommand(userInput, userQuery) {
    switch (userInput) {
        case "concert-this":
            concertThis();
            break;
        case "spotify-this-song":
            spotifyThisSong();
            break;
        case "movie-this":
            movieThis();
            break;
        case "do-what-it-says":
            doWhatItSays(userQuery);
            break;
        default:
            console.log("Command me baby!");
            break;
    }
}

userCommand(userInput, userQuery);

function concertThis() {
    /*Console log a waitng message based on the topic searched by user*/
    console.log(`\n=====================================================================\n\nOne moment, we are Searching for...${userQuery}'s next show...`);
    
    var urlHead = "https://rest.bandsintown.com/artists/";
    var urlTail = userQuery + "/events?app_id=" + bandsInTown;

    /*Like an API instad we use "request" the url for "bands in town". Then we fetch/call the information by manipulating cartain parts of the variable and then concatinate them.*/
    request(urlHead + urlTail, function (err, res, body) {

          /*If there is no error and verything checks out give a message and continue to run throught the next que of functions/conditionals*/
          if (!err && res) {
            console.log("Everything looks good");
              
            /*Fetch the data in JSON format and parse it*/
             var userBand = JSON.parse(body);
 
             /*Use a for loop conditional if the info parsed is greater than 0, if info is zero no data will be parsed or looped*/            
             if (userBand.length > 0) {
                 for (i = 0; i < 1; i++) {
 
                     /*Return search results to the user through console log or throw event*/
                     console.log(`\nHere is your info!\n
                     \n=====================================================================\n
                     Artist: ${userBand[i].lineup[0]}
                     Venue: ${userBand[i].venue.name}
                     Venue Location: ${userBand[i].venue.latitude},${userBand[i].venue.longitude}
                     Venue City & Country: ${userBand[i].venue.city}, ${userBand[i].venue.country}\n`);
 
                     /*Like in the train scheduler LIRI will format the times of the venue date in "MM/DD/YYYY hh:00 A"*/
                     var concertDate = moment(userBand[i].datetime).format("MM/DD/YYYY hh:00 A");
                     console.log(`
                     Date & Time: ${concertDate}
                     \n=====================================================================\n`);
                 };
             } else {
                console.log("There are no bands or concerts found!");
             };
         };
     });
 };
 
 function spotifyThisSong() {
     /*Console log a waitng message based on the topic searched by user*/
     console.log(`\n=====================================================================\n
     One moment, we are Searching for..."${userQuery}"`);
 
     // IF USER QUERY NOT FOUND, PASS VALUE OF "ACE OF BASE" 
     if (!userQuery) {
             userQuery = "the sign ace of base"
     };
 
     /*Spotify search format 1 call limit for one song*/
     spotify.search({
         type: 'track',
         query: userQuery,
         limit: 1
     }, 
     /*second parameter includes a function that evaluates an error event and manupulates the data called from Spotify*/
     function (err, data) {
         if (err) {
            return console.log("An error has happened while finding your song, here's whats wrong: " + err);
         }
         /*organize data into an array despite not being in JASON format*/
         var spotifyArr = data.tracks.items;
 
         /*Make a for loop to sort through the fetched data*/
         for (i = 0; i < spotifyArr.length; i++) {
             console.log(`
             \nHere is your info!\n
             \n=====================================================================\n
             Artist: ${data.tracks.items[i].album.artists[0].name}\n
             Song: ${data.tracks.items[i].name}\n
             Album: ${data.tracks.items[i].album.name}\n
             Spotify link: ${data.tracks.items[i].external_urls.spotify}\n
             \n=====================================================================\n`);
         };
     });
 }
 
 function movieThis() {
     /*Console log a waitng message based on the topic searched by user*/
     console.log(`\n=====================================================================\n
     One moment, we are Searching for..."${userQuery}"`);

     if (!userQuery) {
         userQuery = "mr nobody";
     };
     /*Same like "concertThis" function call. We fetch/call the information by manipulating cartain parts of the variable and then concatinate them.*/
     var urlHead = "http://www.omdbapi.com/?t=";
     var urlTail = userQuery + "&y=&plot=short&apikey=" + omdb;

     axios.get(urlHead + urlTail).then(function (err, res) {
 
 
        /*If there is no error and verything checks out give a message and continue to run throught the next que of functions/conditionals*/
        if (!err && res) {
             console.log("Everything looks good\n=====================================================================\n");
             console.log(`
             \nHere is your info!\n
             \n=====================================================================\n
             Title: ${userMovie.Title}\n
             Cast: ${userMovie.Actors}\n
             Released: ${userMovie.Year}\n
             IMDb Rating: ${userMovie.imdbRating}\n
             Rotten Tomatoes Rating: ${userMovie.Ratings[1].Value}\n
             Country: ${userMovie.Country}\n
             Language: ${userMovie.Language}\n
             Plot: ${userMovie.Plot}\n
             \n=====================================================================\n`);
         } else {
             console.log("An error has happened while finding your movie, here's whats wrong: " + err);
         };
     })
 };
 
 function doWhatItSays() {
     fs.readFile("random.txt", "utf8", function (err, data) {
         if (err) {
             return console.log(err);
         }
 
         /*once data is fetched we seperate it by commas or CSV within an array*/
         let dataArr = data.split(",");
 
         /*Pass Objects from txt file and pass them through param */
         userInput = dataArr[0];
         userQuery = dataArr[1];
     
         /*Call the function so it can run*/
         userCommand(userInput, userQuery);
     });
 };