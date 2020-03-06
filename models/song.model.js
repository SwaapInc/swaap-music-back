module.exports = (sequelize, Sequelize) => {
    const Song = sequelize.define('song', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type:Sequelize.STRING
        },
        artist: {
            type: Sequelize.STRING
        },
        album: {
            type: Sequelize.STRING
        },
        img: {
            type: Sequelize.STRING
        },
        spotify_song_Id: {
            type: Sequelize.STRING
        },
        deezer_song_Id: {
            type: Sequelize.STRING
        }
    })
    
    return Song
  }