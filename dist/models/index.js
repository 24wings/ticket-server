"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const Task_1 = require("./Task");
const User_1 = require("./User");
const TaskTag_1 = require("./TaskTag");
const TaskRecord_1 = require("./TaskRecord");
const WXRechargeRecord_1 = require("./WXRechargeRecord");
const WXGetMoneyRecord_1 = require("./WXGetMoneyRecord");
const GetMoneyRequest_1 = require("./GetMoneyRequest");
const Banner_1 = require("./Banner");
const TaskTemplate_1 = require("./TaskTemplate");
const advert_1 = require("./advert");
const Project_1 = require("./Project");
const WXPayToOne_1 = require("./WXPayToOne");
const ThumbsUp_1 = require("./ThumbsUp");
const Employee_1 = require("./Employee");
const Issue_1 = require("./Issue");
mongoose.connect('mongodb://127.0.0.1:27017/test');
exports.db = {
    userModel: User_1.userModel,
    taskModel: Task_1.taskModel,
    taskTagModel: TaskTag_1.taskTagModel,
    taskRecordModel: TaskRecord_1.taskRecordModel,
    wxGetMoneyRecordModel: WXGetMoneyRecord_1.wxGetMoneyRecordModel,
    wxRechargeRecordModel: WXRechargeRecord_1.wxRechargeRecordModel,
    getMoneyRequestModel: GetMoneyRequest_1.getMoneyRequestModel,
    bannerModel: Banner_1.bannerModel,
    taskTemplateModel: TaskTemplate_1.taskTemplateModel,
    advertModel: advert_1.advertModel,
    projectModel: Project_1.projectModel,
    wxPayToOneModel: WXPayToOne_1.wxPayToOneModel,
    thumbsUpModel: ThumbsUp_1.thumbsUpModel,
    issueModel: Issue_1.issueModel, employeeModel: Employee_1.employeeModel,
};
