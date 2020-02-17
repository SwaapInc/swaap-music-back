module.exports = (sequelize, Sequelize) => {
    const User_Playlist = sequelize.define('user_playlist', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true
        },
        canRead: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        canWrite: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false
        }
    });
    
    return User_Playlist;
  }