"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
var projectSchema = new mongoose.Schema({
    title: { type: String, default: '默认标题' },
    banner: { type: String, default: '' },
    summary: { type: String, default: '默认描述' },
    preview: { type: String, },
    //官网地址
    officeUrl: { type: String, default: '' },
    codeUrl: { type: String, default: '' },
    manages: { type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Employee" }], default: [] },
    testers: { type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Employee" }], default: [] },
    content: { type: String, default: "默认内容" },
    createDt: { type: Date, default: Date.now },
    startDt: { type: Date, default: Date.now },
    endDt: { type: Date, default: Date.now }
});
exports.projectModel = mongoose.model('Project', projectSchema);
