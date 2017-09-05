import { Core } from '../lib';
import path = require('path');
import fs = require('fs');
import config from '../app.config';
import mongoose = require('mongoose');
import moment = require('moment');
@Core.Route.Controller({
    service: 'advert',
})
export default class extends Core.Route.BaseRoute implements Core.Route.IRoute {
    doAction(action: string, method: string, next) {
        switch (action) {
            case 'login': return this.login;
            case 'info': return this.info;
            case 'authCode': return this.authCode;
            case 'queryCode': return this.queryCode;
            case 'taskGroup': return this.taskGroup;
            case 'register': return this.register;
            case 'advertById': return this.advertById;
            case 'taskByAdvertId': return this.taskByAdvertId;
            case 'taskTags': return this.taskList;
            case 'publishTask': return this.publishTask;
            case 'taskOneDayData': return this.taskOneDayData;
            case 'taskWeekData': return this.taskWeekData;
            case 'taskOneMonthData': return this.taskOneMonthData;
            case 'fullEmail': return this.fullEmail;
            case 'taskActive': return this.taskActive;
            case 'task': return this.task;
            case 'forgotPassword': return this.forgotPassword;
            case 'changePassword': return this.changePassword;
        }
    }

    async  changePassword() {
        let { phone, oldPassword, newPassword } = this.ctx.request.body;
        let advert = await this.db.advertModel.findOne({ phone, password: oldPassword }).exec();
        if (advert) {
            let updateAction = await advert.update({ password: newPassword }).exec();
            this.ctx.body = { ok: true, data: updateAction };
        } else {
            this.ctx.body = { ok: false, data: '手机号或密码错误' }

        }

    }
    async  forgotPassword() {
        let { code, phone, newPassword } = this.ctx.request.body;
        let CODES = await config.alidayu.queryCode(phone);
        let messageCode = CODES[0].Content.substr(CODES[0].Content.length - 6);
        if (messageCode == code) {
            let updateAction = await this.db.advertModel.findOne({ phone }).update({ password: newPassword }).exec();
            this.ctx.body = { ok: true, data: updateAction }
        } else {
            this.ctx.body = { ok: false, data: '短信验证码错误' }
        }

    }
    async info() {
        let advert = await this.db.advertModel.findById(this.ctx.query._id).exec();
        this.ctx.body = { ok: !!advert, data: advert }
    }
    async task() {
        let task = await this.db.taskModel.findById(this.ctx.query._id).exec();
        this.ctx.body = { ok: true, data: task };
    }
    async taskActive() {
        let { _id } = this.ctx.query;
        let { active } = this.ctx.request.body;
        let action = await this.db.taskModel.findByIdAndUpdate(_id, { active: !!active }).exec();
        this.ctx.body = { ok: true, data: action };
    }
    async fullEmail() {
        let { email, phone, password } = this.ctx.request.body;
        let advert = await this.db.advertModel.findOne({ phone, password }).exec();
        if (advert) {
            let action = advert.update({ email }).exec();
            this.ctx.body = { ok: true, data: action };
        } else {
            this.ctx.body = { ok: false, data: '该广告商不存在' }

        }



    }
    async taskOneMonthData() {
        let { taskId } = await this.ctx.query;
        let now = new Date();
        // let data = await this.db.taskModel.find({ task: taskId }).exec();
        let dataItems = await this.db.taskRecordModel.aggregate([
            { $match: { createDt: { $lt: new Date(), $gte: new Date(now.getFullYear(), now.getMonth() - 1, now.getDate()) } } },
            { $match: { task: new mongoose.Types.ObjectId(taskId) } },
            { $group: { _id: { $dayOfMonth: '$createDt' }, count: { $sum: 1 } } }
        ]).exec();

        let data = new Array(31);
        data.fill(0);
        dataItems.forEach((item: { _id: number, count: number }) => {
            data[item._id] = item.count;
        });
        this.ctx.body = { ok: true, data };

    }

    async  taskWeekData() {
        let { taskId } = this.ctx.request.query;
        let now = new Date();

        let taskRecordCounts = await this.db.taskRecordModel.aggregate([
            { $match: { createDt: { $lt: new Date(), $gte: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7) } } },
            { $match: { task: new mongoose.Types.ObjectId(taskId) } },
            { $group: { _id: { $dayOfWeek: '$createDt' }, count: { $sum: 1 } } }
        ]).exec();
        let data = new Array(7);
        data.fill(0);
        taskRecordCounts.forEach((item: { _id: number, count: number }) => {
            data[item._id] = item.count;
        });
        this.ctx.body = { ok: true, data };


    }
    async taskOneDayData() {
        let { taskId } = this.ctx.request.query;
        let now = new Date();
        console.log(`taskId:` + taskId);
        let taskData = await this.db.taskRecordModel.aggregate([
            { $match: { createDt: { $lt: new Date(), $gte: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1) } } },
            { $match: { task: new mongoose.Types.ObjectId(taskId) } },
            // { $group: { _id: {$hour:'$createDt'}, count: { $sum: 1 } } },
            {
                $group: {
                    _id: { $hour: '$createDt' },
                    count: { $sum: 1 }
                }
            }
        ]).exec();
        //填充默认数据, 8小时时间差
        let data = new Array(24);
        data.fill(0)
        taskData.forEach((item: { _id: number, count }) => {
            let hour = item._id + 8;
            console.log(hour);
            if (hour >= 24) {
                data[hour - 24] = item.count;
            } else {
                data[hour] = item.count;
            }
        });


        this.ctx.body = { ok: true, data };

    }

    async    publishTask() {
        let { shareMoney, fee, title, url, urlName, taskTag, websiteUrl, bannerImg, imageUrl, startDt = new Date(), publisher } = this.ctx.request.body;

        if (typeof fee == 'string') fee = parseFloat(fee);
        fee = Math.abs(fee);
        if (fee <= 0 || shareMoney <= 0) {
            this.ctx.body = { ok: false, data: '非法的发布金额' }
        } else {
            let advert = await this.db.advertModel.findById(publisher).exec();
            if (advert) {
                if (advert.money < fee) {
                    this.ctx.body = { ok: false, data: '余额不足' };
                } else {

                    await advert.update({ $inc: { money: -fee } }).exec();
                    let newTask = await new this.db.taskModel({ url, urlName, shareMoney, fee, totalMoney: fee, title, taskTag, websiteUrl, bannerImg, imageUrl, startDt, publisher }).save();
                    this.ctx.body = { ok: true, data: newTask };

                }
            } else {
                this.ctx.body = { ok: false, data: '身份认证失败' };
            }
        }
    }

    async taskList() {
        let taskTags = await this.db.taskTagModel.find().exec();
        this.ctx.body = { ok: true, data: taskTags };
    }
    async taskByAdvertId() {
        let tasks = await this.db.taskModel.find({ publisher: this.ctx.query._id }).populate('taskTag').exec();
        this.ctx.body = { ok: true, data: tasks };

    }

    async advertById() {
        let advert = await this.db.advertModel.findById(this.ctx.query._id).exec();
        this.ctx.body = { ok: true, data: advert };


    }
    async taskGroup() {
        let now = new Date();
        let data = await this.db.taskModel.aggregate([
            // { $match: { createDt: { $lt: new Date().getTime(), $gt: new Date(now.getFullYear(), now.getMonth() - 4, now.getDate()).getTime() } } },
            { $group: { _id: '$createDt', count: { $sum: 1 } } }
        ]);
        this.ctx.body = { ok: true, data };

    }
    async before() {
        await this.next();
    }
    after() { }


    index() { this.ctx.body = 'hello'; }
    async login() {
        let { phone, password } = this.ctx.request.body;
        let user = await this.db.advertModel.findOne({ phone, password }).exec();
        this.ctx.body = { ok: !!user, data: !!user ? user : '用户名或密码不存在' };
    }
    async register() {
        let { user: { phone, password }, code } = this.ctx.request.body;
        let user = await this.db.advertModel.findOne({ phone }).exec()
        if (user) {
            this.ctx.body = { ok: false, data: '该手机号已经注册' };
        } else {
            let codes = await config.alidayu.queryCode(phone);

            let messageCode = codes[0].Content.substr(codes[0].Content.length - 6)

            console.log(code, messageCode, code == messageCode);
            if (code != messageCode) {
                this.ctx.body = { ok: false, data: '短信验证码错误' };
            } else {
                let newUser = await new this.db.advertModel({ phone, password }).save()
                this.ctx.body = { ok: true, data: newUser };

            }

        }
    }

    async authCode() {
        let { phone } = this.ctx.request.body;
        let data = await config.alidayu.authCode(phone);
        this.ctx.body = { ok: true, data };
    }

    async queryCode() {
        let { phone } = this.ctx.query;
        let codes = await config.alidayu.queryCode(phone);
        this.ctx.body = { ok: true, data: codes[0] };
    }




} 