module.exports = function(app) {
 
    const controller = require('../controller/deezerAccount.controller.js');
 
    // Create a new Customer
    app.post('/api/deezerAccounts', controller.create);
 
    // Retrieve all Customer
    app.get('/api/deezerAccounts', controller.findAll);
 
    // Retrieve a single Customer by Id
    app.get('/api/deezerAccount/:deezerAccountId', controller.findById);
 
    // Update a Customer with Id
    app.put('/api/deezerAccount/:deezerAccountId', controller.update);
 
    // Delete a Customer with Id
    app.delete('/api/deezerAccount/:deezerAccountId', controller.delete);
}