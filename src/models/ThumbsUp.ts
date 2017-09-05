import mongoose = require('mongoose');


let thumbsUpSchema = new mongoose.Schema({
    url: String,
    num: { type: Number, default: 0 }
});

export interface IThumbsUp extends mongoose.Document {
    url: string;
    num: number;

}
export var thumbsUpModel = mongoose.model<IThumbsUp>('ThumbsUp', thumbsUpSchema);