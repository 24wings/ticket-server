import mongoose = require('mongoose');
import { IEmployee } from './Employee';

export enum IssueType {
    Demand,
    Question,
    Suggestion
}
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

})

export interface Issue extends mongoose.Document {

    title?: string;
    createDt?: Date;
    images?: string[];
    content?: string;
    // 提出人
    publisher?: IEmployee;
    // 解决人
    resolver?: IEmployee;
    state?: boolean;
    // 分类1需求 2问题  3 不过
    type?: IssueType;
}

export var issueModel = mongoose.model('Issue', issueSchema);