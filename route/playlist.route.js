module.exports = function(app) {
 
    const controller = require('../controller/playlist.controller.js');
 
    // Create a new Customer
    app.post('/api/playlists', controller.create);
 
    // Retrieve all Customer
    app.get('/api/playlists', controller.findAll);
 
    // Retrieve a single Customer by Id
    app.get('/api/playlists/:playlistId', controller.findById);
 
    // Update a Customer with Id
    app.put('/api/playlists/:playlistId', controller.update);
 
    // Delete a Customer with Id
    app.delete('/api/playlists/:playlistId', controller.delete);
}