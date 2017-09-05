import mongoose = require('mongoose');


let boardSchema = new mongoose.Schema({
    title: String,
    websiteUrl: String,
    money: { type: Number, default: 0 }
});


export interface IBoard extends mongoose.Document {
    title: string;
    websiteUrl: string;
    money: number;

}

export var boardModel = mongoose.model<IBoard>('Board', boardSchema);