import mongoose = require('mongoose');
import { taskModel } from './Task';
import { userModel } from './User';
import { taskTagModel } from './TaskTag';
import { taskRecordModel } from './TaskRecord';
import { wxRechargeRecordModel } from './WXRechargeRecord';
import { wxGetMoneyRecordModel } from './WXGetMoneyRecord';
import { getMoneyRequestModel } from './GetMoneyRequest';
import { boardModel } from './Board';
import { boardRecordModel } from './BoardRecord';
import { bannerModel } from './Banner';
import { taskTemplateModel } from './TaskTemplate';
import { advertModel } from './advert';
import { projectModel } from './Project';
import { wxPayToOneModel } from './WXPayToOne';
import { thumbsUpModel } from './ThumbsUp';
import {employeeModel} from './Employee';
import {issueModel} from './Issue';
mongoose.connect('mongodb://127.0.0.1:27017/test');


export var db = {
    userModel,
    taskModel,
    taskTagModel,
    taskRecordModel,
    wxGetMoneyRecordModel,
    wxRechargeRecordModel,
    getMoneyRequestModel,
    bannerModel,
    taskTemplateModel,
    advertModel,
    projectModel,
    wxPayToOneModel,
    thumbsUpModel,
    issueModel,employeeModel,
    
}