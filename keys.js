/*keys.js file*/
console.log("My Keys Have Loaded");

exports.BandsInTown = {
    id: process.env.BANDSINTOWN_ID
}

exports.spotify = {
  id: process.env.SPOTIFY_ID,
  secret: process.env.SPOTIFY_SECRET
};

exports.omdb = {
    id: process.env.OMDB_ID
}
