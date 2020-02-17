module.exports = function(app) {
 
    const controller = require('../controller/user.controller.js');
 
    // Create a new Customer
    app.post('/api/users', controller.create);
 
    // Retrieve all Customer
    app.get('/api/users', controller.findAll);
 
    // Retrieve a single Customer by Id
    app.get('/api/users/:userId', controller.findById);
 
    // Update a Customer with Id
    app.put('/api/users/:userId', controller.update);
 
    // Delete a Customer with Id
    app.delete('/api/users/:userId', controller.delete);
}