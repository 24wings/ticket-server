import mongoose = require('mongoose');

let wxPayToOneSchme = new mongoose.Schema({
    return_code: [String],
    return_msg: [String],
    nonce_str: [String],
    result_code: [String],
    partner_trade_no: [String],
    payment_no: [String],
    payment_time: [String]
});

export interface IWXPayToOne extends mongoose.Document {
    return_code: string[];
    return_msg: string[];
    nonce_str: string[];
    result_code: string[];
    partner_trade_noe;
    payment_time: string[]
}

export var wxPayToOneModel = mongoose.model<IWXPayToOne>('WXPayToOne', wxPayToOneSchme);


