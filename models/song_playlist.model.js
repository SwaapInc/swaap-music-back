module.exports = (sequelize, Sequelize) => {
    const Song_Playlist = sequelize.define('song_playlist', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true
        }
    });
    
    return Song_Playlist;
  }