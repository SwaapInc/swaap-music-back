const db = require('../config/db.config.js');
const Playlist = db.playlist;
const SongPlaylist = db.song_playlist

exports.create = (req, res) => {
    const {body} = req.request
    console.log('body')
    console.log(body)
    Playlist.create({
        name: body.name,
        updated: body.email,
        deezer_Id: body.tracks.deezer_Id,
        spotify_Id: body.tracks.spotify_Id,
    }).then(playlist => {
        res.send(playlist);
    });
};

exports.findAll = (req, res) => {
    Playlist.findAll().then(playlists => {
        res.send(playlist);
    });
};

exports.findById = (req, res) => {
    Playlist.findById(req.params.playlistId).then(playlist => {
        res.send(playlist);
    })
};

exports.update = (req, res) => {
    const id = req.params.playlistId;
    const {body} = req.request

    console.log('body')
    console.log(body)

    Playlist.update({
            name: body.name,
            updated: body.email,
            deezer_Id: body.deezer_Id,
            spotify_Id: body.spotify_Id,
        },
        {where: {id: req.params.playlistId}}
    ).then(() => {
        res.status(200).send("updated successfully a playlist with id = " + id);
    });
};

exports.delete = (req, res) => {
    const id = req.params.playlistId;
    Playlist.destroy({
        where: {id: id}
    }).then(() => {
        res.status(200).send('deleted successfully a playlist with id = ' + id);
    });
};

exports.addSong = (req, res) => {
    const {body} = req.request
    const playlistId = body.playlistId
    const songId = body.songId
    SongPlaylist.create({})
}

exports.removeSong = (req, res) => {

}