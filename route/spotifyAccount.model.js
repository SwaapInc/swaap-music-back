module.exports = function(app) {
 
    const controller = require('../controller/spotifyAccount.controller.js');
 
    // Create a new Customer
    app.post('/api/spotifyAccounts', controller.create);
  
    // Retrieve a single Customer by Id
    app.get('/api/spotifyAccounts/:spotifyAccountId', controller.findById);

    // Delete a Customer with Id
    app.delete('/api/spotifyAccounts/:spotifyAccountId', controller.delete);
}