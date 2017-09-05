"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//用户登录表
const mongoose = require("mongoose");
let advertSchema = new mongoose.Schema({
    phone: String,
    password: String,
    createDt: { type: Date, default: Date.now },
    // 余额
    money: { type: Number, default: 0 },
    //历史产生的金额
    historyMoney: { type: Number, default: 0 }
});
exports.advertModel = mongoose.model('Advert', advertSchema);
