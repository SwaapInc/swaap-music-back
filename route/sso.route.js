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
}

