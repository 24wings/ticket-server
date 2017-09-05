"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
var messageSchema = new mongoose.Schema({
    from: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    to: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    title: { type: String, default: '默认标题' },
    content: { type: String, default: "默认内容" },
    createDt: { type: Date, default: Date.now }
});
exports.messageModel = mongoose.model('Message', exports.messageModel);
