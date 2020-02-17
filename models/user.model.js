module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define('user', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true
        },
        username: {
            type: Sequelize.STRING,
            unique: true
        },
        email: {
            type: Sequelize.STRING,
            unique: true
        },
        password: {
            type: Sequelize.STRING
        },
        first_name: {
            type: Sequelize.STRING
        },
        name: {
            type: Sequelize.STRING
        }
    });
    
    return User;
  }