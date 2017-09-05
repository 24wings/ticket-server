"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
let employeeSchema = new mongoose.Schema({
    truename: String,
    nickname: String,
    phone: String,
    password: String,
    summary: { type: String, default: '' },
    editProject: { type: Boolean, default: false },
    createProject: { type: Boolean, default: false },
    deleteProject: { type: Boolean, default: false },
    editIssue: { type: Boolean, default: false },
    deleteIssue: { type: Boolean, default: false },
    createIssue: { type: Boolean, default: false },
    createDt: { type: Date, default: Date.now },
});
exports.employeeModel = mongoose.model('Employee', employeeSchema);
