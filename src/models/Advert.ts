
//用户登录表
import mongoose = require('mongoose');

let advertSchema = new mongoose.Schema({
    phone: String,
    password: String,
    createDt: { type: Date, default: Date.now },
    // 余额
    money: { type: Number, default: 0 },
    //历史产生的金额
    historyMoney: { type: Number, default: 0 }
});
export interface IAdvert extends mongoose.Document {
    phone: number;
    password: string;
    createDt: Date;
    money: number;
    historyMoney: number;

}
export var advertModel = mongoose.model<IAdvert>('Advert', advertSchema); 