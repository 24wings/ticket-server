"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
let taskTemplateSchema = new mongoose.Schema({
    title: String,
    videoUrl: String,
    images: [String],
    createDt: { type: Date, default: Date.now }
});
exports.taskTemplateModel = mongoose.model('TaskTemplate', taskTemplateSchema);
