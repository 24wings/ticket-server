"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
let boardRecordSchema = new mongoose.Schema({
    board: { type: mongoose.Schema.Types.ObjectId, ref: 'Board' },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createDt: { type: Date, default: Date.now }
});
exports.boardRecordModel = mongoose.model('BoardRecord', boardRecordSchema);
