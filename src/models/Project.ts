import mongoose = require('mongoose');
import {IEmployee} from './Employee';
import { IUser } from './User';
var projectSchema = new mongoose.Schema({

    title: { type: String, default: '默认标题' },
    banner:{type:String,default:''},
    summary: { type: String, default: '默认描述' },
    preview: { type: String, },
    //官网地址
    officeUrl: { type: String, default: '' },
    codeUrl: { type: String, default: '' },
    manages:{type:[{type:mongoose.Schema.Types.ObjectId,ref:"Employee"}],default:[]},
    testers:{type:[{type:mongoose.Schema.Types.ObjectId,ref:"Employee"}],default:[]},
    content: { type: String, default: "默认内容" },
    createDt: { type: Date, default: Date.now },
    startDt: { type: Date, default: Date.now },
    endDt: { type: Date, default: Date.now }

})

export interface IProject extends mongoose.Document {
    
    title?: string;
    banner?: string;
    name?: string;
    createDt?: Date;
    manages?: IEmployee[];
    summary?: string;
    testers?: IEmployee[];
    activeDemandNums?: number
    demandNums?: number
    activeQuestionNums?: number
    questionNums?: number

}

export var projectModel = mongoose.model<IProject>('Project', projectSchema);
