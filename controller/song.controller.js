const db = require('../config/db.config.js');
const Song = db.song;

exports.create = async (ctx) => {

    const body = ctx.request.body
    
    const response = await Song.create({
        name: body.name,
        artist: body.artist,
        img: body.img,
        album: body.album,
        spotify_song_Id: body.spotify_Song_Id,
        deezer_song_Id: body.deezer_Song_Id
    }, async (res) => {
        ctx.body = {
            status: 200,
            body: res
        }
    });

    ctx.body = response

};

exports.findAll = async (ctx) => {
    const response = await Song.findAll({}, async (res) => {
        return {
            status: 200,
            body: songs
        }
    });

    ctx.body = response

};

exports.findById = async (ctx) => {
    const params = ctx.params
    const id = params.id;    

    const response = await Song.findByPk(id, async (res) => {
        return {
            status: 200,
            body: song
        }
    })

    ctx.body = response

};

exports.update = async (ctx) => {
    const params = ctx.params
    const body = ctx.request.body
    const id = params.id;    

    const response = await Song.update({
            name: body.name,
            artist: body.artist,
            img: body.img,
            album: body.album,
            spotify_song_Id: body.spotify_Song_Id,
            deezer_song_Id: body.deezer_Song_Id
        },
        {where: {id: id}}
    , async () => {
        return {
            status: 200,
            body: 'updated successfully a song with id = ' + id
        }
    });

    ctx.body = response

};

exports.delete = async (ctx) => {
    const params = ctx.params
    const id = params.id;   

    const response = await Song.destroy({
        where: {id: id}
    }, async () => {
        return {
            status: 200,
            body: "deleted successfully a song with id = " + id
        }
    });

    ctx.body = response

};


exports.getDeezerId = async (ctx) => {
    const params = ctx.params
    const id = params.id;

    const response = await Song.findByPK(id, async (res) => {
        return {
            status: 200,
            body: song.deezer_song_Id
        }
    })

    ctx.body = response

}

exports.getSpotifyId = async (ctx) => {
    const params = ctx.params
    const id = params.id;

    const response = await Song.findByPK(id, async (res) => {
        return {
            status: 200,
            body: song.spotify_song_Id
        }
    })

    ctx.body = response

}