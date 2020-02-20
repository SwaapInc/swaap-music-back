const request = require('request')

module.exports = function(app) {
    const redirect_uri = "https://swaap-music-front.heroku.com/public/callback";
    const client_id = '3a16f4201e6f4549b7b16283c35fe93c'
    const client_secret = '2156058ab5884df6a7ab03689a78824c'

    app.post('user', '/api/spotify/authentication/callback', async (ctx) => {
        const {code} = ctx.request.body
        const authOptions = {
            url: 'https://accounts.spotify.com/api/token',
            form: {
                code: code,
                redirect_uri: redirect_uri,
                grant_type: 'authorization_code',
            },
            headers: {
                'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
            },
            json: true
        };
        const res = await request.post(authOptions, async (error, response, body) => {
            if (!error && response.statusCode === 200) {
                const access_token = body.access_token,
                    refresh_token = body.refresh_token;
                return JSON.stringify({
                    access_token,
                    refresh_token,
                })
            } else {
                return 'invalid token';
            }
        });

        ctx.body = res;
    })
}

