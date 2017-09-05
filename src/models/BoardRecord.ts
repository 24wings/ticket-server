import mongoose = require('mongoose');
import { IUser } from './User';
import { IBoard } from './Board';
let boardRecordSchema = new mongoose.Schema({
    board: { type: mongoose.Schema.Types.ObjectId, ref: 'Board' },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createDt: { type: Date, default: Date.now }
});

export interface IBoardRecord extends mongoose.Document {
    user: IUser;
    createDt: Date;
}

export var boardRecordModel = mongoose.model<IBoardRecord>('BoardRecord', boardRecordSchema);