module.exports = (sequelize, Sequelize) => {
    const Playlist = sequelize.define('playlist', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: Sequelize.STRING
        },
        updated: {
            type: Sequelize.BOOLEAN
        },
        deezer_Id: {
            type: Sequelize.STRING
        },
        spotify_Id: {
            type: Sequelize.STRING
        }
    })
    
    return Playlist
  }