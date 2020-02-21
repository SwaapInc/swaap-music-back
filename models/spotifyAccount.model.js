module.exports = (sequelize, Sequelize) => {
    const SpotifyAccount = sequelize.define('spotifyAccount', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        }
    });
    
    return SpotifyAccount;
  }