console.log('this is loaded');

exports.spotify = {
  id: process.env.SPOTIFY_ID,
  secret: process.env.SPOTIFY_SECRET
}


exports.bandsInTown = {
    id: process.env.APP_ID,
}

exports.OMDB = {
    id: process.env.API_KEY
}