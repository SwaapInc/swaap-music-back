const db = require('../config/db.config.js');
const Song = db.song;
const Playlist = db.playlist

exports.create = async (ctx) => {
    const body = ctx.request.body

    const response = await Playlist.create({
        name: body.name,
        updated: false,
        ownerId: body.ownerId,
        deezer_Id: body.deezer_Id,
        spotify_Id: body.spotify_Id,
    }, async (res) => {
        return {
            status: 200,
            body: res
        }
    })

    ctx.body = response
};

exports.findAll = async (ctx) => {
    const params = ctx.params
    const id = params.id

    const response = await Playlist.findAll({
        where: {ownerId: id},
        include: [{
            model: Song
        }]
    }, async (res) => {
        return {
            status: 200,
            body: res
        }
    }).catch((res) => {
        return {
            status: 400,
            body: res
        }
    })
    ctx.body = response
};

exports.findById = async (ctx) => {
    const params = ctx.params
    const id = params.id

    const response = await Playlist.findByPk(id, async (res) => {
        return {
            status: 200,
            body: res
        }
    })
    
    ctx.body = response
};

exports.update = async (ctx) => {
    const params = ctx.params
    const body = ctx.request.body
    const id = params.id;

    var response = Playlist.update({
        name: body.name,
        updated: true,
        deezer_Id: body.deezer_Id,
        spotify_Id: body.spotify_Id,
        },
        {
            where: {id: id}
        }
    , async (res) => {
        return {
            status: 200,
            body: res
        }
    });
    ctx.body = response
};

exports.delete = async (ctx) => {
    const params = ctx.params
    const id = params.id;

    var response = await Playlist.destroy({
        where: {id: id}
    }).then(() => {
        return {
            status: 200,
            body: "deleted successfully a playlist with id = " + id
        }
    });

    ctx.body = response
};

exports.updateTracks = async (ctx) => {
    const params = ctx.params
    const body = ctx.request.body
    const id = params.id

    const songs = [];
    const ids = body.ids;
    
    for (var i = 0; i < ids.length; i++) {
        var song = await Song.findByPk(ids[i]);
        songs.push(song);
    }

    var playlist = await Playlist.findByPk(id)
    if(playlist === null) 
        ctx.body = {
            status: 400,
            body: 'playlist id:' + id + ' not found'
        }
    else {
        const response = new Promise((resolve, reject) => {
            playlist.setSongs(songs, () => {
                resolve ({
                    status:200,
                    body: 'ok'
                })
            })
        })

        ctx.body = response
    }
    // var response = await Playlist.findByPk(id, async(res) => {
    //     if(res == null)
    //         return {
    //             status: 400,
    //             body: 'playlist id:' + id + ' not found'
    //         }
    //     else {
    //         return await playlist.setSongs(songs, async() => {
    //             return {
    //                 status: 200,
    //                 body: 'ok'
    //             }
    //         });
    //     }
    // })
    
    // if(playlist == null) {
    //     return {
    //             status: 400,
    //             body: 'playlist id:' + id + ' not found'
    //         }
    //     }
    //     playlist.setSongs(songs);
    // }).then(x =>{
    //     return {
    //         status: 200,
    //         body: 'tracks have been added to playlist ' + id
    //     }
    // })

    //ctx.body = response
}
