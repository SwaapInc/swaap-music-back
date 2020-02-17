const env = require('./env.js')

const Sequelize = require('sequelize')
const sequelize = new Sequelize(env.database, env.username, env.password, {
  host: env.host,
  dialect: env.dialect,
  operatorsAliases: false,
  pool: {
    max: env.max,
    min: env.pool.min,
    acquire: env.pool.acquire,
    idle: env.pool.idle
  }
})
 
const db = {}
 
db.Sequelize = Sequelize
db.sequelize = sequelize
 
//Models/tables
db.user = require('../models/user.model.js')(sequelize, Sequelize)
db.playlist = require('../models/playlist.model.js')(sequelize, Sequelize)
db.song = require('../models/song.model.js')(sequelize, Sequelize)
db.deezerAccount = require('../models/deezerAccount.model.js')(sequelize, Sequelize)
db.spotifyAccount = require('../models/spotifyAccount.model.js')(sequelize, Sequelize)
db.song_playlist = require('../models/song_playlist.model.js')(sequelize, Sequelize)
db.user_playlist = require('../models/user_playlist.model.js')(sequelize, Sequelize)

const User = db.user
const Playlist = db.playlist
const Song = db.song
const DeezerAccount = db.deezerAccount
const SpotifyAccount = db.spotifyAccount
const User_Playlist = db.user_playlist
const Song_Playlist = db.song_playlist

User.hasOne(SpotifyAccount, {as: 'spotifyAccount', foreignKey: 'spotifyAccountId'})
User.hasOne(DeezerAccount, {as: 'deezerAccount', foreignKey: 'deezerAccountId'})
Playlist.belongsTo(User, {as: 'owner', foreignKey: 'ownerId'})

User.belongsToMany(Playlist, { through: User_Playlist, foreignKey: 'userId' })
Playlist.belongsToMany(User, { through: User_Playlist, foreignKey: 'playlistId' })

Song.belongsToMany(Playlist, { through: Song_Playlist, foreignKey: 'songId' })
Playlist.belongsToMany(Song, { through: Song_Playlist, foreignKey: 'playlistId' })

module.exports = db;
