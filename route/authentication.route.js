module.exports = function(app) {

    const formatUserLite = (user) => {
        return {
            id: user.id,
            username: user.username,
            email: user.email,
            firstName: user.first_name,
            name: user.name,
        }
    }

    const userController = require('../controller/user.controller.js');
    const bcrypt = require('bcrypt');

    app.post('/api/authenticate', async (ctx) => {
        const {body} = ctx.request;
        const {username, password} = body;
        const user = await userController.findByUserName(ctx)
        if (user.password) {
            const hash = bcrypt.compareSync(password, user.password);
            if(hash) { //Authentification succes
                console.log('user')
                console.log(user)
                const userLite = formatUserLite(user);
                console.log('userLite')
                console.log(userLite)
                const a = {
                    status: 200,
                    body: 'Authentication success for username : ' + username,
                    userInfos : {
                        user: userLite,
                        playlists: {
                            playlistsDeezer: [

                                    {
                                        name: 'Bain moussant',
                                        api: 2,
                                        id: '908622995',
                                        image: 'https://e-cdns-images.dzcdn.net/images/playlist/f50bfcf1df80d845b83a6213a61d6aa8/250x250-000000-80-0-0.jpg',
                                    },

                                    {
                                        name: 'Deezer Hits',
                                        api: 2,
                                        id: '1363560485',
                                        image: 'https://e-cdns-images.dzcdn.net/images/playlist/f454e1f4859261051b05308bcb0fa4b8/250x250-000000-80-0-0.jpg',
                                    },
                            ],
                            playlistsSpotify: [],
                            playlistsSaved: [
                                {
                                        name: "Hello_world",
                                        id: 1,
                                        tracks: [
                                            {
                                                spotify: "1DMEzmAoQIikcL52psptQL",
                                                deezer: "572537052",
                                            },
                                            {
                                                spotify: "2QTDuJIGKUjR7E2Q6KupIh",
                                                deezer: "119437636",
                                            },
                                            {
                                                spotify: "0ScgmigVOJr2mFsAtwFQmz",
                                                deezer: "2657826",
                                            },
                                            {
                                                spotify: "1NZWiuy0mlnsrcYL2dhKt6",
                                                deezer: "104623136",
                                            },
                                        ],
                                        image: "https://i.ytimg.com/vi/zecueq-mo4M/maxresdefault.jpg",
                                    },
                                {
                                        name: "Hello_world",
                                        id: 2,
                                        tracks: [
                                            {
                                                spotify: "1DMEzmAoQIikcL52psptQL",
                                                deezer: "572537052",
                                            },
                                            {
                                                spotify: "2QTDuJIGKUjR7E2Q6KupIh",
                                                deezer: "119437636",
                                            },
                                            {
                                                spotify: "0ScgmigVOJr2mFsAtwFQmz",
                                                deezer: "2657826",
                                            },
                                            {
                                                spotify: "1NZWiuy0mlnsrcYL2dhKt6",
                                                deezer: "104623136",
                                            },
                                        ],
                                        image: "https://i.ytimg.com/vi/zecueq-mo4M/maxresdefault.jpg",
                                    }

                            ]
                        }
                    }
                }
                ctx.body = a;
            } else {
                ctx.body =  {
                    status: 400,
                    body: 'Authentication failed for username : ' + username,
                    userInfos: null,
                }
            }
        } else {
            ctx.body = {
                status: 400,
                body: 'Aut,hentication failed for username : ' + username,
                userInfos: null
            }
        }
    })
}