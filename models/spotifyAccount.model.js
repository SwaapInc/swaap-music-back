module.exports = (sequelize, Sequelize) => {
    const SpotifyAccount = sequelize.define('spotifyAccount', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true
        }
    });
    
    return SpotifyAccount;
  }