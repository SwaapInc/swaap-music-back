module.exports = (sequelize, Sequelize) => {
    const DeezerAccount = sequelize.define('deezerAccount', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true
        }
    });
    
    return DeezerAccount
  }