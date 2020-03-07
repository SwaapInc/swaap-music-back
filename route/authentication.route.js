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
                const userLite = formatUserLite(user);
                //todo get saved playlist and return it
                const a = {
                    status: 200,
                    body: 'Authentication success for username : ' + username,
                    userInfos : {
                        user: userLite,
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