import mongoose= require('mongoose');

let  employeeSchema = new mongoose.Schema({
    truename:String,
    nickname:String,
    phone:String,
    password:String,
    summary:{type:String,default:''},
    editProject:{type:Boolean,default:false},
    createProject:{type:Boolean,default:false},
    deleteProject:{type:Boolean,default:false},
    editIssue:{type:Boolean,default:false},
    deleteIssue:{type:Boolean,default:false},
    createIssue:{type:Boolean,default:false},
    createDt:{type:Date,default:Date.now},
    
});
export interface IEmployee extends mongoose.Document{
truename?: string;
nickname?: string;
phone?: string;
password:string;
createDt?: Date;
checked?: boolean;
createProject?: boolean;
editProject?: boolean;
deleteProject?: boolean;
createIssue?: boolean;
editIssue?: boolean;
deleteIssue?: boolean;
summary:string;
}

export var  employeeModel = mongoose.model<IEmployee>('Employee',employeeSchema);