module.exports = function(app) {
 
    const controller = require('../controller/song.controller.js');
 
    // Create a new Customer
    app.post('/api/songs', controller.create);
 
    // Retrieve all Customer
    app.get('/api/songs', controller.findAll);
 
    // Retrieve a single Customer by Id
    app.get('/api/songs/:songId', controller.findById);
 
    // Update a Customer with Id
    app.put('/api/songs/:songId', controller.update);
 
    // Delete a Customer with Id
    app.delete('/api/songs/:songId', controller.delete);
    
    //get deezer song from spotifyId
    app.get('/api/deezerSong/:spotifyId', controller.getDeezerId);

    //get spotify song from deezerId
    app.get('/api/spotifySong/:deezerId', controller.getSpotifyId);
}