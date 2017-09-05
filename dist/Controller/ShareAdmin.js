"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const lib_1 = require("../lib");
let default_1 = class extends lib_1.Core.Route.BaseRoute {
    doAction(action, method, next) {
        switch (action) {
            case 'rest':
                switch (method) {
                    case 'get': return this.restGet;
                    case 'post': return this.restPost;
                    case 'put': return this.restPut;
                    case 'delete': return this.restDelete;
                    default: return this.index;
                }
                ;
            case 'taskTaskAndChildren': return this.taskTagAndChildren;
            case 'mainInfo': return this.mainInfo;
            case 'systemLog': return this.systemLog;
            case 'task-delete': return this.taskDelete;
            case 'task-edit': return this.taskEdit;
            case 'taskTag-list': return this.taskTagList;
            case 'taskTag-edit': return 'get' == method ? this.taskTagEditPage : this.taskTagEdit;
            case "taskTag-delete": return this.taskTagDelete;
            case 'taskRecord-edit': return this.taskRecordEdit;
            case 'task-list': return this.taskList;
            case 'recharge-list': return this.rechargeList;
            case 'relationTree': return this.relationTree;
            case 'userClickRecord': return this.userClickRecord;
            case 'taskTag': switch (method) {
                case 'get': return this.getTaskTag;
                case 'post': return this.addTaskTag;
            }
            case 'taskByTaskTag': return this.taskByTaskTag;
            case 'addBanner': return this.addBanner;
            case 'banners': return this.banners;
            case 'toggleBannerActive': return this.toggleBannerActive;
            case 'removeBanner': return this.removeBanner;
            case 'users': return this.users;
            case 'login': return this.login;
            case 'nameSearch': return this.nameSearch;
            default: return this.index;
        }
    }
    async nameSearch() {
        let { keyword } = this.ctx.query;
        let users = await this.db.userModel.find({ nickname: new RegExp(keyword, 'g') }).exec();
        this.ctx.body = { ok: true, data: users };
    }
    async login() {
        let { username, password } = this.ctx.request.body;
        if (username == 'moon' && password == 'moon') {
            this.ctx.body = { ok: true, data: { username, password } };
        }
        else {
            this.ctx.body = { ok: false, data: '管理员密码错误' };
        }
    }
    async users() {
        let users = await this.db.userModel.find().exec();
        this.ctx.body = { ok: true, data: users };
    }
    async removeBanner() {
        let del = await this.db.bannerModel.findByIdAndRemove(this.ctx.query._id).exec();
        this.ctx.body = { ok: true, data: del };
    }
    /**
     * POST 请求
     */
    async toggleBannerActive() {
        let { _id, active } = this.ctx.request.body;
        let action = await this.db.bannerModel.findByIdAndUpdate(_id, { active: !!active }).exec();
        this.ctx.body = { ok: true, data: action };
    }
    async banners() {
        let data = await this.db.bannerModel.find().populate('task').exec();
        this.ctx.body = { ok: true, data };
    }
    async addBanner() {
        let { taskId } = this.ctx.query;
        let newBanner = await new this.db.bannerModel({ task: taskId }).save();
        this.ctx.body = { ok: true, data: newBanner };
    }
    async taskByTaskTag() {
        let { taskTag } = this.ctx.query;
        let tasks = await this.db.taskModel.find({ taskTag }).exec();
        this.ctx.body = { ok: true, data: tasks };
    }
    async taskTagAndChildren() {
        var taskTags = await this.db.taskTagModel.find().sort({ sort: -1 }).exec();
        var taskNums = [];
        for (let taskTag of taskTags) {
            taskTag = taskTag._id.toString();
            let taskNum = await this.db.taskModel.find({ taskTag }).count().exec();
            taskNums.push(taskNum);
        }
        this.ctx.body = { ok: true, data: { taskTags, taskNums } };
    }
    async getTaskTag() {
        let { _id } = this.ctx.query;
        if (_id) {
            let taskTag = await this.db.taskTagModel.findById(_id).exec();
            this.ctx.body = { ok: true, data: taskTag };
        }
        else {
            let taskTags = await this.db.taskTagModel.find().sort({ sort: '-1' }).exec();
            this.ctx.body = { ok: true, data: taskTags };
        }
    }
    async addTaskTag() {
        let { name, sort } = this.ctx.request.body;
        let newTaskTag = await new this.db.taskTagModel({ name, sort }).save();
        this.ctx.body = { ok: true, data: newTaskTag };
    }
    async userClickRecord() {
        let { userId } = this.ctx.query;
        let taskRecords = await this.db.taskRecordModel.find({ 'shareDetail.user': { $in: [userId] } }).populate('task shareDetail.user').exec();
        this.ctx.body = { ok: true, data: taskRecords };
    }
    async relationTree() {
        //5979aa66f97b400ef876681d
        let _id = this.ctx.query.userId;
        let user = await this.db.userModel.findById(_id).exec(); //返回数据     
        let tree = {
            level1Parent: null,
            level2Parent: null,
            level3Parent: null,
            level1Children: [],
            level2Children: [],
            level3Children: [],
        };
        await user.populate('parent').execPopulate();
        //查上三级
        if (user.parent) {
            console.log('查找到一级师傅', user.parent);
            console.log('查找到一级师傅', user.parent);
            tree.level1Parent = user.parent;
            await user.parent.populate('parent').execPopulate();
            ;
            if (user.parent.parent) {
                tree.level2Parent = user.parent.parent;
                await user.parent.parent.populate('parent').execPopulate();
                ;
                if (user.parent.parent.parent) {
                    tree.level3Parent = user.parent.parent.parent;
                }
            }
        }
        // 查下三级
        tree.level1Children = await this.db.userModel.find({ parent: _id }).exec();
        if (tree.level1Children.length > 0) {
            let childrenIds = tree.level1Children.map(child => child._id.toString());
            tree.level2Children = await this.db.userModel.find({ parent: { $in: childrenIds } }).exec();
            childrenIds = tree.level2Children.map(child => child._id.toString());
            console.log(childrenIds);
            tree.level3Children = await this.db.userModel.find({ parent: { $in: childrenIds } }).exec();
        }
        console.log(tree);
        this.ctx.body = {
            ok: true,
            data: {
                tree
            }
        };
    }
    async rechargeList() {
        // let page = this.req.query.page || 0;
        let rechargeLists = await this.db.wxRechargeRecordModel.find().skip(0 * 30).limit(30).populate('user').sort({ createDt: -1 }).exec();
        let count = await this.db.wxRechargeRecordModel.find().count().exec();
        this.ctx.body = {
            ok: true,
            data: {
                rechargeLists,
                count
            }
        };
    }
    async taskList() {
        let tasks = await this.db.taskModel.find(this.ctx.query).populate('publisher').exec();
        this.ctx.body = { ok: true, data: tasks };
    }
    async taskRecordEdit() {
        let taskRecord = await this.service.db.taskRecordModel.findById(this.ctx.query._id).exec();
        let orders = taskRecord.shareDetail;
        for (let order of orders) {
            let temp = await this.service.db.userModel.findById(order.user).exec();
            order.user = temp;
        }
        var task = await this.service.db.taskModel.findById(taskRecord.task).exec();
        this.ctx.body = { ok: true, data: task };
    }
    async taskEdit() {
        // var _id = this.req.query._id;
        // var task = await this.service.db.taskModel.findById(_id).populate('taskTag').exec();
        // var taskTags = await this.service.db.taskTagModel.find().exec();
        // var taskRecords = await this.service.db.taskRecordModel.find({ task: task._id.toString() }).exec();
        // console.log(taskRecords);
        // this.res.render('share-admin/task-edit', { task, taskRecords, taskTags });
    }
    async taskTagEdit() {
        // let { _id, name, sort } = this.req.body;
        // await this.service.db.taskTagModel.findByIdAndUpdate(_id, { $set: { name, sort } }).exec();
        // this.res.redirect('/share-admin/taskTag-list');
    }
    async taskTagEditPage() {
        // let taskTag = await this.service.db.taskTagModel.findById(this.req.query._id).exec();
        // let subTasks = await this.service.db.taskModel.find({ taskTag: taskTag._id.toString() }).exec();
        // this.res.render('share-admin/taskTag-edit', { taskTag, subTasks });
    }
    // login() {
    // let { username, password } = this.req.body;
    // if (username == 'admin' && password == '123') {
    // this.req.session.admin = {
    // username,
    // password
    // };
    // this.res.redirect('/share-admin/index')
    // } else {
    // this.res.render('share-admin/login', { errorMsg: '用户名或密码不正确' });
    // }
    // }
    loginPage() {
        // this.res.render('share-admin/login');
    }
    async taskTagDelete() {
        let action = await this.service.db.taskTagModel.findByIdAndRemove(this.ctx.query._id).exec();
        // this.res.redirect(`/share-admin/taskTag-list`);
    }
    async taskDelete() {
        // var _id = this.req.query._id;
        // let action = await this.service.db.taskModel.findByIdAndRemove(_id).exec();
        // this.res.redirect(`/share-admin/task-list`);
    }
    async taskTagList() {
        var taskTags = await this.db.taskTagModel.find().exec();
        var taskNums = [];
        for (let taskTag of taskTags) {
            taskTag = taskTag._id.toString();
            let taskNum = await this.db.taskModel.find({ taskTag }).count().exec();
            taskNums.push(taskNum);
        }
        // this.render('taskTag-list', { taskTags, taskNums });
    }
    async taskTagNewPageDo() {
        // let { name } = this.req.body;
        // let newTaskTag = await new this.service.db.taskTagModel({ name }).save();
        // this.res.redirect('/share-admin/taskTag-list');
    }
    async systemLog() {
        let day = new Date();
        let currentTime = new Date(day.getFullYear(), day.getMonth(), day.getDate()).getTime(); //今日的起始时间
        // console.log(new Date(new Date().getTime() + 28800000));
        // console.log(111, new Date(today.getFullYear(),today.getMonth(),today.getDate()));
        // console.log(333, new Date(currentTime+28800000));
        // 昨日的起始时间 00:00:00
        let yesStart = currentTime - 1 * 24 * 60 * 60 * 1000;
        let yesEnd = currentTime;
        //今日的起始时间 00:00:00
        let todayStart = currentTime;
        let todayEnd = todayStart + 1 * 24 * 60 * 60 * 1000;
        //上周的起始时间
        //本周的起始时间
        let weekStart = currentTime - 7 * 24 * 60 * 60 * 1000;
        let weekEnd = todayEnd;
        //console.log(`todayStart:${todayStart}, todayEnd:${todayEnd}`);
        //昨日注册人数
        let yesSignupCount = await this.db.userModel.find().where('createDt').gt(yesStart).lt(yesEnd).count().exec();
        //今日注册人数
        let todaySignupCount = await this.db.userModel.find().where('createDt').gt(todayStart).lt(todayEnd).count().exec();
        // 活跃的结果集, 数组类型
        let yesTaskRecords = await this.db.taskRecordModel.find().where('createDt').gt(yesStart).lt(yesEnd).exec();
        let todayTaskRecords = await this.db.taskRecordModel.find().where('createDt').gt(todayStart).lt(todayEnd).exec();
        let weekTaskRecords = await this.db.taskRecordModel.find().where('createDt').gt(weekStart).lt(weekEnd).exec();
        // let tests = await this.db.userModel.find({historyMoney:0.2, isFinish:false}).exec();
        let yesActiveUsers = []; //昨日活跃
        let activeUsers = []; //今日活跃
        let weekActiveUsers = []; //本周活跃
        yesTaskRecords.forEach(yesRecord => {
            if (yesActiveUsers.includes(yesRecord.shareDetail[0].user)) {
            }
            else {
                yesActiveUsers.push(yesRecord.shareDetail[0].user);
            }
        });
        todayTaskRecords.forEach(record => {
            if (activeUsers.includes(record.shareDetail[0].user)) {
            }
            else {
                activeUsers.push(record.shareDetail[0].user);
            }
        });
        weekTaskRecords.forEach(weekRecord => {
            if (weekActiveUsers.includes(weekRecord.shareDetail[0].user)) {
            }
            else {
                weekActiveUsers.push(weekRecord.shareDetail[0].user);
            }
        });
        let totalNum = await this.db.userModel.find().count();
        this.ctx.body = {
            ok: true,
            data: {
                yesSignupCount,
                todaySignupCount,
                yesActiveUserNum: yesActiveUsers.length,
                todayActiveUserNum: activeUsers.length,
                weekActiveUserNum: weekActiveUsers.length,
                totalNum //用户总数
            }
        };
    }
    async mainInfo() {
        let userCount = await this.db.userModel.find().count().exec();
        let taskTagCount = await this.db.taskTagModel.find().count().exec();
        let activeTaskCount = await this.db.taskModel.find({ active: true }).count().exec();
        let unActiveTaskCount = await this.db.taskModel.find({ active: false }).count().exec();
        this.ctx.body = {
            ok: true,
            data: {
                userCount,
                taskTagCount,
                activeTaskCount,
                unActiveTaskCount,
            }
        };
    }
    async before() {
        await this.next();
    }
    after() { }
    index() {
        this.ctx.body = 'hello';
    }
    async restGet() {
        //
        let { model, page = 0, pageSize = 10, keyword, keys, _id, isCount, sort, desc, queryKey, queryValue } = this.ctx.query;
        if (typeof pageSize == 'string')
            pageSize = parseInt(pageSize);
        if (typeof page == 'string')
            page = parseInt(page);
        if (this.db[model]) {
            let table = this.db[model];
            // 获取总页数
            if (isCount) {
                let count = await table.find().count().exec();
                this.ctx.body = { ok: true, data: count };
            }
            else {
                //详情
                if (_id) {
                    let item = await table.findById(_id).exec();
                    this.ctx.body = { ok: true, data: item };
                }
                else {
                    let sorter = new Object();
                    if (sort && desc) {
                        Object.defineProperty(sorter, sort, { writable: true, enumerable: true, configurable: true, value: desc == 'true' || desc == true ? '1' : '-1' });
                    }
                    let query = new Object();
                    // 分类查询
                    if (queryKey && queryValue) {
                        Object.defineProperty(query, queryKey, { writable: true, enumerable: true, value: queryValue, configurable: true });
                    }
                    // 关键字查询搜索
                    if (keyword && keys) {
                        keys = keys.split(',');
                        for (let key of keys) {
                            Object.defineProperty(query, key, { value: new RegExp(keyword, 'g'), writable: true, configurable: true, enumerable: true });
                        }
                        let items = await table.find(query).sort(sorter).skip(page * pageSize).limit(pageSize).exec();
                        this.ctx.body = { ok: true, data: items };
                    }
                    else {
                        let items = await table.find(query).sort(sorter).skip(pageSize * page).limit(pageSize).exec();
                        this.ctx.body = { ok: true, data: items };
                    }
                }
            }
        }
        else {
            this.ctx.body = {
                ok: false,
                data: '数据库表不存在'
            };
        }
    }
    async restPost() {
        let { model } = this.ctx.query;
        let item = this.ctx.request.body;
        if (this.db[model]) {
            let table = this.db[model];
            let action = await new table(item).save();
            this.ctx.body = {
                ok: true,
                data: action
            };
        }
        else {
            this.ctx.body = {
                ok: false,
                data: '数据库表不存在'
            };
        }
    }
    async restPut() {
        let { _id, model } = this.ctx.query;
        let item = this.ctx.request.body;
        if (this.db[model]) {
            let table = this.db[model];
            let putAction = await table.findByIdAndUpdate(_id, item).exec();
            this.ctx.body = { ok: true, data: putAction };
        }
        else {
            this.ctx.body = { ok: true, data: '数据表不存在' };
        }
    }
    async restDelete() {
        let { _id, model } = this.ctx.query;
        if (this.db[model]) {
            let table = this.db[model];
            let delAction = await table.findByIdAndRemove(_id).exec();
            this.ctx.body = { ok: true, data: delAction };
        }
        else {
            this.ctx.body = { ok: true, data: '数据表不存在' };
        }
    }
};
default_1 = __decorate([
    lib_1.Core.Route.Controller({
        service: 'admin',
    })
], default_1);
exports.default = default_1;
