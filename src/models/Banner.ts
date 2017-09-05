import mongoose = require('mongoose');


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

export interface IBanner extends mongoose.Document {
    task: any;
    bannerImg: string;
    sort: number;
    active: boolean;
    useTime: { startDt: Date, endDt: Date }[];
    createDt: Date,
    canuse: Boolean;
    lastModifyDt: Date
}

export var bannerModel = mongoose.model<IBanner>('Banner', bannerSchema)