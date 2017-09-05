"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
let bannerSchema = new mongoose.Schema({
    task: { type: mongoose.Schema.Types.ObjectId, ref: 'Task' },
    bannerImg: { type: String, },
    // 值越大越优先
    sort: { type: Number, default: 0 },
    active: { type: Boolean, default: false },
    // 使用时间段记录
    useTime: { type: [{ startDt: Date, endDt: Date }] },
    createDt: { type: Date, default: Date.now },
    lastModifyDt: { type: Date, default: Date.now },
    canUse: { type: Boolean, default: true }
});
exports.bannerModel = mongoose.model('Banner', bannerSchema);
