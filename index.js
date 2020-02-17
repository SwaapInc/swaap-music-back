'use strict';
const koa = require('koa')
const path = require('path')
const render = require('koa-ejs')
const koaRouter = require('koa-router')
const bodyParser = require('koa-bodyparser')
const request = require('request')
const fs = require('fs')

const app = new koa()
const router = new koaRouter()
const playlistRouter = require('./route/playlist.route')
const deezerAccountRouter = require('./route/deezerAccount.route')
const songRouter = require('./route/song.route')
const spotifyAccountRouter = require('./route/spotifyAccount.model')
const userRouter = require('./route/user.route')
const db = require('./config/db.config.js');
  
db.sequelize.sync().then(() => {
  console.log('DB has been synchronized { force: false }');
});

function writeAccessToken(entry) {
    fs.writeFile('./properties/access.json', entry, (err) => {
        if (err) throw err;
    })
}

function readAccessToken() {
    return new Promise((resolve, reject) => {
        fs.readFile('./properties/access.json', 'utf8', (err, data) => {
            if (err)
                reject(err)
            resolve(JSON.parse(data))
        })
    })
}

async function isAccessTokenValid() {
    const dateNow = new Date()
    const data = await readAccessToken()
    const expiredAt = data['expired_at']
    return expiredAt > (dateNow.getTime() / 1000)
}

function getNewAccessToken() {
    return new Promise((resolve, reject) => {
        const client_id = '3a16f4201e6f4549b7b16283c35fe93c'
        const client_secret = '2156058ab5884df6a7ab03689a78824c'
        request.post({
            url: 'https://accounts.spotify.com/api/token',
            headers: { 'Authorization': 'Basic ' + (new Buffer(`${client_id}:${client_secret}`).toString('base64')) },
            form: { grant_type: 'client_credentials' }
        }, (err, res, body) => {
            if (err) {
                console.error('Failed : ', err)
                reject(err)
            }
            if (res.statusCode == 200) {
                console.log('statusCode : ', res && res.statusCode)

                let accessToken = JSON.parse(body)['access_token']
                let accessExpirationTime = Math.floor(Date.now() / 1000) + JSON.parse(body)['expires_in']

                let entry = JSON.stringify({
                    'access_token': accessToken,
                    'expired_at': accessExpirationTime
                })
                writeAccessToken(entry)
                resolve(accessToken)
            } else {
                console.log('Failed : ', res.statusCode)
                reject(res)
            }
        })
    })
}

app.use(bodyParser())

app.use(async (ctx, next) => {
    try {
        await next()
    } catch (err) {
        console.log(err.status)
        ctx.status = err.status || 500;
        ctx.body = err.message;
    }
})

render(app, {
    root: path.join(__dirname, 'views'),
    layout: 'layout',
    viewExt: 'html',
    cache: false,
    debug: true
})

router.get('koala', '/', (ctx) => {
    ctx.body = "Welcome! To the Koala Book of Everything!"
})

/*
 * example : get object from id http://localhost:1234/spotify/get/artists/0OdUWJ0sBjDrqHygGUXeCF
 */
router.get('get_playlist_spotify', '/api/spotify/get/playlists/:id/tracks',async (ctx) => {
    const query = ctx.request.query
    const {limit, offset} = query

    let accessToken
    if (await isAccessTokenValid()) {
        //console.log('valid')
        accessToken = (await readAccessToken())['access_token']
    } else {
        //console.log('expired')
        accessToken = await getNewAccessToken()
    }

    const options = {
        url: `https://api.spotify.com/v1/playlists/${ctx.params.id}/tracks?limit=${limit}&offset=${offset}`,
        headers: { 'Authorization': 'Bearer ' + accessToken }
    }

    const res = await request(options, function (error, response, body) {
        console.error('error : ', error)
        console.log('statusCode : ', response && response.statusCode)
        return body
    })

    ctx.body = res
})

/* 
 * example : get object from id http://localhost:1234/spotify/get/artists/0OdUWJ0sBjDrqHygGUXeCF
 */
router.get('get_data_spotify', '/api/spotify/get/:object/:id',async (ctx) => {
    let accessToken
    if (await isAccessTokenValid()) {
        accessToken = (await readAccessToken())['access_token']
    } else {
        accessToken = await getNewAccessToken()
    }

    const options = {
        url: `https://api.spotify.com/v1/${ctx.params.object}/${ctx.params.id}`,
        headers: { 'Authorization': 'Bearer ' + accessToken }
    }

    const res = await request(options, function (error, response, body) {
        console.error('error : ', error)
        console.log('statusCode : ', response && response.statusCode)
        return body
    })

    ctx.body = res
})

/* 
 * example : search track with artist and track name http://localhost:1234/spotify/search?q=artist:seether+track:careless%20whisper&type=track
 *           search track with track name only http://localhost:1234/spotify/search?q=track:careless%20whisper&type=track
 */
router.get('search_spotify', '/api/spotify/search', async (ctx) => {
    let query = ctx.request.query
    let type = query.type
    let search = query.q

    let accessToken
    if (await isAccessTokenValid()) {
        accessToken = (await readAccessToken())['access_token']
    } else {
        accessToken = await getNewAccessToken()
    }

    const options = {
        url: `https://api.spotify.com/v1/search?q=${search}&type=${type}`,
        headers: { 'Authorization': 'Bearer ' + accessToken }
    }

    const res = await request(options, function (error, response, body) {
        console.error('error : ', error)
        console.log('statusCode : ', response.statusCode)
        return body
    })

    ctx.body = res
})

router.get('advanced_search_spotify', '/api/spotify/search/advanced', async (ctx) => {
    const {query} = ctx.request
    const {type, title, artist, album} = query
    let url
    if(album !== null) {
        url = `https://api.spotify.com/v1/search?q=artist:${artist} track:${title} album:${album}&type=${type}`
    } else {
        url = `https://api.spotify.com/v1/search?q=artist:${artist} track:${title}&type=${type}"`
    }

    let accessToken
    if (await isAccessTokenValid()) {
        accessToken = (await readAccessToken())['access_token']
    } else {
        accessToken = await getNewAccessToken()
    }

    const options = {
        url,
        headers: { 'Authorization': 'Bearer ' + accessToken }
    }

    const res = await request(options, function (error, response, body) {
        console.error('error : ', error)
        console.log('statusCode : ', response && response.statusCode)
        return body
    })

    ctx.body = res
})

router.get('get_playlist_deezer', '/api/deezer/get/playlists/:id/tracks',async (ctx) => {
    const query = ctx.request.query
    const {limit, offset} = query

    const options = {
        url: `https://api.deezer.com/playlist/${ctx.params.id}/tracks?limit=${limit}&index=${offset}`,
    }

    const res = await request(options, function (error, response, body) {
        console.error('error : ', error)
        console.log('statusCode : ', response && response.statusCode)
        return body
    })

    ctx.body = res
})

router.get('get_data_deezer', '/api/deezer/get/:object/:id', async (ctx) => {

    const options = {
        url: `https://api.deezer.com/${ctx.params.object}/${ctx.params.id}`
    }

    const res = await request(options, function (error, response, body) {
        console.error('error : ', error)
        console.log('statusCode : ', response && response.statusCode)
        return body
    })

    ctx.body = res
})

router.get('search_deezer', '/api/deezer/search/', async (ctx) => {
    let search = ctx.request.query['q']
    let limit = 20 //TODO : See how to manage it

    const url = `https://api.deezer.com/search/track?q=${search}&limit=${limit}&type=track`;

    const options = {
        url: url
    }

    const res = await request(options, function (error, response, body) {
        console.error('error : ', error)
        console.log('statusCode : ', response && response.statusCode)
        return body
    })

    ctx.body = res
})

router.get('advanced_search_deezer', '/api/deezer/search/advanced', async (ctx) => {
    const {query} = ctx.request
    const {title, artist, album, type} = query
    let url
    if(album !== null) {
        url = `https://api.deezer.com/search?q=artist:"${artist}"track:"${title}""album:"${album}&type=${type}`
    } else {
        url = `https://api.deezer.com/search?q=artist:"${artist}"track:"${title}&type=track"`
    }

    const options = {
        url
    }

    const res = await request(options, function (error, response, body) {
        console.error('error : ', error)
        console.log('statusCode : ', response && response.statusCode)
        return body
    })

    ctx.body = res
})

router.post('user', '/api/user', async (ctx) => {
    ctx.body = JSON.stringify({
        id: 1,
        pseudo: 'Jeremy',
        role: 0,
        avatar: '/dist/assets/media/users/jeremy_morvan.jpg'
    })
})

router.get('get_user_playlist', '/api/user/playlist/:id', async (ctx) => {
    let accessToken
    if (await isAccessTokenValid()) {
        //console.log('valid')
        accessToken = (await readAccessToken())['access_token']
    } else {
        //console.log('expired')
        accessToken = await getNewAccessToken()
    }

    const options = {
        url: `https://api.spotify.com/v1/playlists/${ctx.params.id}`,
        headers: { 'Authorization': 'Bearer ' + accessToken }
    }

    const res = await request(options, function (error, response, body) {
        console.error('error : ', error)
        console.log('statusCode : ', response && response.statusCode)
        return body
    })

    ctx.body = res
})

playlistRouter(router)
songRouter(router)
spotifyAccountRouter(router)
//deezerAccountRouter(router)
userRouter(router)

app.use(router.routes())
    .use(router.allowedMethods())

app.listen(1234, () => console.log('running on port 1234'))
