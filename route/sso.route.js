const request = require('request')

module.exports = function(app) {
    const redirect_uri = "https://swaap-music-front.herokuapp.com/public/callback";
    const client_id_spotify = '3a16f4201e6f4549b7b16283c35fe93c'
    const client_secret_spotify = '2156058ab5884df6a7ab03689a78824c'

    const client_id_deezer = '399164'
    const client_secret_deezer = 'c6b51d30e8687c14a8d7e02b98380546'

    app.post('callback_spotify', '/api/spotify/authentication/callback', async (ctx) => {
        const {code} = ctx.request.body
        const authOptions = {
            url: 'https://accounts.spotify.com/api/token',
            form: {
                code: code,
                redirect_uri: redirect_uri,
                grant_type: 'authorization_code',
            },
            headers: {
                'Authorization': 'Basic ' + (new Buffer(client_id_spotify + ':' + client_secret_spotify).toString('base64'))
            },
            json: true
        };

        await new Promise((resolve, reject) => {
            request.post(authOptions, async (error, response, body) => {
                if (response.statusCode === 200) {
                    const access_token = body.access_token,
                        refresh_token = body.refresh_token;
                    resolve (
                        {
                            status: response.statusCode,
                            tokens: {
                                access_token,
                                refresh_token,
                            }
                        })
                } else {
                    reject( {
                        status: response.statusCode,
                        body: response.body
                    })
                }
            })
        }).then((resolve) => {
            ctx.body = resolve
        }).catch((reject) => {
            ctx.body = reject
        })
    })

    app.post('callback_deezer', '/api/deezer/authentication/callback', async (ctx) => {
        const {code} = ctx.request.body
        const url = `https://connect.deezer.com/oauth/access_token.php`
            +`?app_id=${client_id_deezer}`
            +`&secret=${client_secret_deezer}`
            +`&code=${code}&output=json`

        await new Promise((resolve, reject) => {
            request.get(url, async (error, response, body) => {
                //todo : implement result
                try {
                    const json = JSON.parse(response.body)
                    resolve ({
                        status: response.statusCode,
                        tokens: {
                            access_token: json.access_token,
                        }
                    })
                } catch (e) {
                    reject({
                        status: 400,
                        body: response.body
                    })
                }
                })
        }).then((resolve) => {
            ctx.body = resolve
        }).catch((reject) => {
            ctx.body = reject
        })
    })

    app.get('user_infos_spotify', '/api/spotify/user', async (ctx) => {
        const {query} = ctx.request
        const {access_token} = query

        const authOptions = {
            url: 'https://api.spotify.com/v1/me',
            headers: {
                'Authorization': `Bearer ${access_token}`
            },
        }

        await new Promise((resolve, reject) => {
            request.get(authOptions, async (error, response, body) => {
                const res = JSON.parse(body)
                if (response.statusCode === 200) {
                    resolve (
                        {
                            status: 200,
                            body: {
                                id: res.id
                            }
                        })
                } else {
                    reject( {
                        status: response.statusCode,
                        body: res.error.message
                    })
                }
            })
        }).then((resolve) => {
            ctx.body = resolve
        }).catch((reject) => {
            ctx.body = reject
        })
    })

    app.post('create_user_playlists_spotify', '/api/spotify/user/playlists', async (ctx) => {
        const {accessToken, userId, playlistName} = ctx.request.body

        const authOptions = {
            url: `https://api.spotify.com/v1/users/${userId}/playlists`,
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: playlistName,
                public: false
            })
        }
        await new Promise((resolve, reject) => {
            request.post(authOptions, async (error, response, body) => {
                const res = JSON.parse(body)
                if (response.statusCode === 201) {
                    resolve (
                        {
                            status: 201,
                            body: {
                                id: res.id
                            }
                        })
                } else {
                    reject( {
                        status: response.statusCode,
                        body: res.error.message
                    })
                }
            })
        }).then((resolve) => {
            ctx.body = resolve
        }).catch((reject) => {
            ctx.body = reject
        })
    })

    app.post('create_user_playlists_deezer', '/api/deezer/user/playlists', async (ctx) => {
        const {accessToken, playlistName} = ctx.request.body

        const url = `https://api.deezer.com/user/me/playlists`
                + `?access_token=${accessToken}`
                + `&title=${playlistName}`

        await new Promise((resolve, reject) => {
            request.post(url, async (error, response, body) => {
                const res = JSON.parse(body)
                if(res.id) {
                    resolve({
                        status: 201,
                        body: {
                            id: res.id
                        },
                    })
                } else {
                    reject( {
                        status: '400',
                        body: res.body
                    })
                }
            })
        }).then((resolve) => {
            ctx.body = resolve
        }).catch((reject) => {
            ctx.body = reject
        })
    })

    app.put('replace_playlist_spotify', '/api/spotify/playlists', async (ctx) => {
        const {accessToken, playlistId, playlist} = ctx.request.body
        let playlistFormat
        try {
            playlistFormat = playlist.map((track) => `spotify:track:${track}`)
        }catch (e) {
            playlistFormat = []
        }
        const authOptions = {
            url: `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                uris: playlistFormat
            })
        }

        await new Promise((resolve, reject) => {
            request.put(authOptions, async (error, response, body) => {
                const res = JSON.parse(body)
                if (response.statusCode === 201) {
                    resolve ({
                            status: 201
                        })
                } else {
                    reject( {
                        status: response.statusCode,
                        body: res.error.message
                    })
                }
            })
        }).then((resolve) => {
            ctx.body = resolve
        }).catch((reject) => {
            ctx.body = reject
        })
    })

    app.post('add_playlist_spotify', '/api/spotify/playlists', async (ctx) => {
        const {accessToken, playlistId, playlist} = ctx.request.body
        let playlistFormat
        try {
            playlistFormat = playlist.map((track) => `spotify:track:${track}`)
        }catch (e) {
            playlistFormat = []
        }
        const authOptions = {
            url: `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                uris: playlistFormat
            })
        }

        await new Promise((resolve, reject) => {
            request.post(authOptions, async (error, response, body) => {
                const res = JSON.parse(body)
                if (response.statusCode === 201) {
                    resolve ({
                        status: 201
                    })
                } else {
                    reject( {
                        status: response.statusCode,
                        body: res.error.message
                    })
                }
            })
        }).then((resolve) => {
            ctx.body = resolve
        }).catch((reject) => {
            ctx.body = reject
        })
    })

    app.post('add_playlist_deezer', '/api/deezer/playlists', async (ctx) => {
        const {accessToken, playlistId, playlist} = ctx.request.body
        let playlistFormat
        try {
            playlistFormat = playlist.toString()
        }catch (e) {
            playlistFormat = ''
        }

        const url = `https://api.deezer.com/playlist/${playlistId}/tracks`
                + `?access_token=${accessToken}`
                + `&songs=${playlistFormat}`
                + `&`

        await new Promise((resolve, reject) => {
            request.post(url, async (error, response, body) => {
                const res = JSON.parse(body)
                if (res === true) {
                    resolve ({
                        status: 201
                    })
                } else {
                    reject( {
                        status: response.statusCode,
                        body: res.error.message
                    })
                }
            })
        }).then((resolve) => {
            ctx.body = resolve
        }).catch((reject) => {
            ctx.body = reject
        })
    })

}

