"use strict";
const models_1 = require("../models");
const tools = require("./tools");
const dbDo = require("./dbDo");
async function getOfficeUser() {
    let user = await models_1.db.userModel.findOne({ nickname: 'admin', openid: 'admin' }).exec();
    if (user) {
        return user;
    }
    else {
        user = await new models_1.db.userModel({ nickname: 'admin', openid: 'admin' }).save();
        return user;
    }
}
models_1.db.userModel.find({ nickname: '' }).remove().exec();
module.exports = {
    db: models_1.db,
    tools,
    dbDo,
    getOfficeUser
};
