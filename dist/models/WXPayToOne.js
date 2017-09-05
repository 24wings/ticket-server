"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
let wxPayToOneSchme = new mongoose.Schema({
    return_code: [String],
    return_msg: [String],
    nonce_str: [String],
    result_code: [String],
    partner_trade_no: [String],
    payment_no: [String],
    payment_time: [String]
});
exports.wxPayToOneModel = mongoose.model('WXPayToOne', wxPayToOneSchme);
