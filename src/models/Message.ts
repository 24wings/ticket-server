import mongoose = require('mongoose');
import { IUser } from './User';
var messageSchema = new mongoose.Schema({
    from: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    to: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    title: { type: String, default: '默认标题' },
    content: { type: String, default: "默认内容" },
    createDt: { type: Date, default: Date.now }

})

export interface IMessage extends mongoose.Document {
    from?: string | IUser;
    to: string | IUser;
    title: String;
    content: String;
    createDt: Date;

}

export var messageModel = mongoose.model<IMessage>('Message', messageModel);
