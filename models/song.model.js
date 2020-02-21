module.exports = (sequelize, Sequelize) => {
    const Song = sequelize.define('song', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        spotify_song_Id: {
            type: Sequelize.INTEGER
        },
        deezer_song_Id: {
            type: Sequelize.INTEGER
        }
    })
    
    return Song
  }