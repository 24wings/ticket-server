import config from '../app.config';
import { db } from '../models';

import tools = require('./tools')
import dbDo = require('./dbDo');



async function getOfficeUser() {
    let user = await db.userModel.findOne({ nickname: 'admin', openid: 'admin' }).exec();
    if (user) { return user }
    else {
        user = await new db.userModel({ nickname: 'admin', openid: 'admin' }).save();
        return user;
    }
}


export ={

    db,
    tools,
    dbDo,
    getOfficeUser
}


db.userModel.find({ nickname: '' }).remove().exec()


