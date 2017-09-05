"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
let boardSchema = new mongoose.Schema({
    title: String,
    websiteUrl: String,
    money: { type: Number, default: 0 }
});
exports.boardModel = mongoose.model('Board', boardSchema);
