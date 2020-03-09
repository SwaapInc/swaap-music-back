module.exports = function(app) {
 
    const controller = require('../controller/playlist.controller.js');
 
    // Create a new Playlist
    app.post('/api/playlists', controller.create);
 
    // Retrieve a user playlists
    app.get('/api/user/:id/playlists', controller.findAll);
 
    // Retrieve a single Playlist by Id
    app.get('/api/playlists/:id', controller.findById);
 
    // Update a Playlist with Id
    app.put('/api/playlists/:id', controller.update);
 
    // Delete a Playlist with Id
    app.delete('/api/playlists/:id', controller.delete);

    // Update a Playlist tracks with playlist id
    app.put('/api/tracks/:id', controller.updateTracks);
}