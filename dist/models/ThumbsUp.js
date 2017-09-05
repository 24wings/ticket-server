"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
let thumbsUpSchema = new mongoose.Schema({
    url: String,
    num: { type: Number, default: 0 }
});
exports.thumbsUpModel = mongoose.model('ThumbsUp', thumbsUpSchema);
