const db = require('../config/db.config.js');
const bcrypt = require('bcrypt');
const User = db.user;

const formatUserLite = (user) => {
    return {
        id: user.id,
        username: user.username,
        email: user.email,
        firstName: user.first_name,
        name: user.name,
    }
}

exports.create = async (ctx) => {
    const {body} = ctx.request
    const res = await new Promise((resolve, reject) => {
        bcrypt.hash(body.password, 10, async (err, hash) => {
            if (hash) {
                try {
                    const data = await User.create({
                        username: body.username,
                        email: body.email,
                        password: hash,
                        first_name: body.first_name,
                        name: body.name
                    })

                    const user = data.toJSON()
                    const userLite = formatUserLite(user)
                    resolve({
                        status: 200,
                        userInfos: userLite
                    })
                } catch (e) {
                    reject({
                        status: 500,
                        body: "create user failed : here was err : " + err,
                    })
                }
            } else {
                reject({
                    status: 400,
                    body: "create user failed : here was err : " + err,
                })
            }
        })
    })
    ctx.body = res
};

exports.findAll = async (ctx) => {
    const res = await User.findAll().then(users => {
        const usersLite = users.map(user => formatUserLite(user))
        return usersLite;
    });
    ctx.body = res;
};

exports.findByPk = async (ctx) => {
    const res = await User.findByPk(ctx.params.userId).then(user => {
        const userLite = formatUserLite(user)
        return userLite;
    })
    ctx.body = res;
};

exports.findByUserName = async (ctx) => {
    const {username} = ctx.request.body
    const res = await User.findOne({
        where: {
            username
        }
    }).then(user => {
        return user ? user.dataValues : {};
    });
    return res;
}

exports.update = async (ctx) => {
    const id = ctx.params.userId;
    const {body} = ctx.request
    const res = await User.update({
            username: body.username,
            email: body.email,
            password: body.password,
            first_name: body.first_name,
            name: body.name
        },
        {where: {id: ctx.params.userId}}
    ).then((response) => {
        if(response[0] === 1) {
            return {
                status: 200,
                body: "updated successfully a user with id = " + id,
            }
        } else {
            return {
                status: 400,
                body: "updated failed of user with id = " + id,
            }
        }
    });
    ctx.body = res;
};

exports.delete = async (ctx) => {
    const id = ctx.params.userId;
    const res = await User.destroy({
        where: {id: id}
    }).then((response) => {
        if(response === 1) {
            return {
                status: 200,
                body: 'deleted successfully a user with id = ' + id,
            }
        } else {
            return {
                status: 400,
                body: "deleted failed of user with id = " + id,
            }
        }
    });
    ctx.body = res;
};
