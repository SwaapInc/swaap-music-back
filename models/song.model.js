module.exports = (sequelize, Sequelize) => {
    const Song = sequelize.define('song', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true
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