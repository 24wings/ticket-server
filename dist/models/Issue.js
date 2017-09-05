"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
var IssueType;
(function (IssueType) {
    IssueType[IssueType["Demand"] = 0] = "Demand";
    IssueType[IssueType["Question"] = 1] = "Question";
    IssueType[IssueType["Suggestion"] = 2] = "Suggestion";
})(IssueType = exports.IssueType || (exports.IssueType = {}));
let issueSchema = new mongoose.Schema({
    title: { type: String, default: '' },
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
    images: { type: [String], default: [] },
    content: { type: String, default: '' },
    publisher: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' },
    resolver: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' },
    state: { type: Boolean, default: false },
    /// 0 ,1,2,4
    type: { type: Number, default: IssueType.Demand },
    createDt: { type: Date, default: Date.now },
});
exports.issueModel = mongoose.model('Issue', issueSchema);
