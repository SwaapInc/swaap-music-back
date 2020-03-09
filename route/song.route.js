module.exports = function(app) {
 
    const controller = require('../controller/song.controller.js');
 
    // Create a new song
    app.post('/api/songs', controller.create);
 
    // Retrieve all songs
    app.get('/api/songs', controller.findAll);
 
    // Retrieve a single song by Id
    app.get('/api/songs/:id', controller.findById);
 
    // Update a song with Id
    app.put('/api/songs/:id', controller.update);
 
    // Delete a song with Id
    app.delete('/api/songs/:id', controller.delete);
    
    //get deezer id by id
    app.get('/api/deezerSong/:id', controller.getDeezerId);

    //get spotify id by id
    app.get('/api/spotifySong/:id', controller.getSpotifyId);
}