"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const lib_1 = require("../lib");
const app_config_1 = require("../app.config");
let default_1 = class extends lib_1.Core.Route.BaseRoute {
    constructor() {
        super();
    }
    doAction(action, method, next) {
        switch (action) {
            case 'index': return this.index;
            case 'user': return this.user;
            case 'task': return this.task;
            case 'tasks': return this.tasks;
            case 'taskRecord': return this.taskRecord;
            case 'studentCode': return this.recruitStudent;
            case 'person-center': return this.personCenter;
            case 'getMoneyRecord': return this.getMoneyRecord;
            case 'fansMoney': return this.fansMoney;
            case 'advertInfo': return this.advertInfo;
            case 'payTaskMoney': return this.payTaskMoney;
            case 'advertTasks': return this.advertTasks;
            case 'fullInfo': switch (method) {
                case 'get': return this.fullInfoPage;
                case 'post': return this.fixFullInfo;
            }
            case 'taskTag-list': return this.taskTagList;
            case 'publishTask': switch (method) {
                case 'get': return this.publishPage;
                case 'post': return this.publishTask;
            }
            case 'payTaskMoney': return this.payTaskMoney;
            case 'student-money': return this.studentMoney;
            case 'myMoney': return this.myMoney;
            case 'taskDetail': return this.taskDetail;
            case 'getMoney':
                switch (method) {
                    case 'get': return this.getMoney;
                    case 'post': return this.getMoneyDo;
                }
                ;
            case 'guide': return this.guide;
            // case 'qqGroup': return this.qqGroup;
            case 'get-money-record': return this.getMoneyRecord;
            case 'money-log': return this.moneyLog;
            case 'share-money': return this.shareMoney;
            case 'task-page': return this.taskPage;
            case 'thumbsup': switch (method) {
                case 'get': return this.thumbsUp;
                case 'post': return this.thumbsUpDo;
            }
            case 'records': return this.records;
            default: return this.index;
        }
    }
    async records() {
        this.ctx.body = await this.db.taskRecordModel.find().limit(20).exec();
    }
    async taskTagList() {
        let data = await this.db.taskTagModel.find().exec();
        this.ctx.body = { ok: true, data };
    }
    async advertTasks() {
        let { active, userId } = this.ctx.query;
        active = !!active;
        let tasks = [];
        if (active) {
            tasks = await this.service.db.taskModel.find({ publisher: userId }).exec();
        }
        else {
            tasks = await this.service.db.taskModel.find({ publisher: userId, active: true }).exec();
        }
        this.ctx.body = { ok: true, data: tasks };
    }
    async tasks() {
        let { page, taskTag, pageSize } = this.ctx.request.query;
        pageSize = 10;
        page = page ? page : 0;
        let tasks = [];
        let skipNum = pageSize * page;
        console.log(skipNum);
        if (taskTag) {
            tasks = await this.db.taskModel.find({ active: true, taskTag }).skip(pageSize * page).limit(pageSize).exec();
        }
        else {
            tasks = await this.db.taskModel.find({ active: true }).skip(skipNum).limit(pageSize).exec();
        }
        this.ctx.body = { ok: true, data: tasks };
    }
    async taskRecord() {
        let taskRecords = await this.db.taskRecordModel.find({ 'shareDetail.user': this.ctx.query.userId }).populate('task').exec();
        this.ctx.body = { ok: true, data: taskRecords };
    }
    async task() {
        let task = await this.db.taskModel.findById(this.ctx.query._id).exec();
        this.ctx.body = { ok: true, data: task };
    }
    async user() {
        let user = await this.db.userModel.findOne(this.ctx.query).exec();
        console.log('user', user);
        this.ctx.body = { ok: true, data: user };
    }
    async fansMoney() {
        let { userId } = this.ctx.query;
        let now = new Date().getTime();
        let before24h = now - 24 * 60 * 60 * 1000;
        let taskRecords = await this.db.taskRecordModel
            .find({ 'shareDetail.user': { $in: [userId] } })
            .where('createDt').gt(before24h).lt(now).sort({ createDt: -1 }).populate('task').exec();
        let allMoney = 0;
        // 本身收益 
        let allMyMoney = 0;
        // 1级收益
        let level1 = {
            num: 0,
            money: 0
        };
        let level2 = {
            num: 0,
            money: 0
        };
        let level3 = {
            num: 0,
            money: 0
        };
        taskRecords.forEach(taskRecord => {
            let order = taskRecord.shareDetail.find(order => order.user == userId);
            allMyMoney += taskRecord.shareDetail[0].user == userId ? taskRecord.shareDetail[0].money : 0;
            let index = taskRecord.shareDetail.indexOf(order);
            //
            switch (index) {
                case 0:
                    break;
                case 1:
                    level1.money += taskRecord.shareDetail[0].money;
                    level1.num++;
                    break;
                case 2:
                    level1.money += taskRecord.shareDetail[0].money;
                    level2.money += taskRecord.shareDetail[1].money;
                    level1.num++;
                    level2.num++;
                    break;
                case 3:
                    level1.money += taskRecord.shareDetail[0].money;
                    level2.money += taskRecord.shareDetail[1].money;
                    level3.money += taskRecord.shareDetail[2].money;
                    level1.num++;
                    level2.num++;
                    level3.num++;
                    break;
            }
            allMoney += order.money;
        });
        this.ctx.body = { ok: true, data: { allMoney, allMyMoney, level1, level2, level3 } };
    }
    async thumbsUp() {
        let { url } = this.ctx.query;
        let thumb = await this.db.thumbsUpModel.findOne({ url }).exec();
        if (thumb) {
            this.ctx.body = { ok: true, data: thumb.num };
        }
        else {
            this.ctx.body = { ok: true, data: 0 };
            await new this.db.thumbsUpModel({ url, num: 0 }).save();
        }
    }
    async thumbsUpDo() {
        let { url } = this.ctx.body;
        url = url ? url : '';
        let thumb = await this.db.thumbsUpModel.findOne({ url }).update({ $inc: { num: 1 } }).exec();
        this.ctx.body = { ok: true, data: thumb };
    }
    // async qqGroup() {
    //     this.display();
    // }
    async taskPage() {
        /*
       let page = this.req.query.page || 0;
       let taskTag = this.req.query.taskTag;
       let tasks = [];
       if (taskTag) {
           tasks = await this.db.taskModel.find({ taskTag }).skip(10 * page).limit(10).exec();
       } else {
           tasks = await this.db.taskModel.find().skip(10 * page).limit(10).exec();
       }
       this.res.json({ ok: true, data: tasks });
*/
    }
    async shareMoney() {
        /*
        let taskRecords = await this.db.taskRecordModel
            .find({ 'shareDetail.user': this.req.session.user._id.toString() })
            .populate('task').exec();
        if (taskRecords.length > 0) {
            console.log(JSON.stringify(taskRecords[0].shareDetail));
        } else {
            console.log('taskRecords')
        }
        this.render('share-money', { taskRecords });
        */
    }
    async before() {
        await this.next();
    }
    after() {
        this.next();
    }
    /**返回首页的内容 */
    async index() {
        let { taskTag } = this.ctx.query;
        let tasks = [];
        let banners = await this.service.db.bannerModel.find({ active: true }).populate('task').exec();
        let taskTags = await this.service.db.taskTagModel.find().exec();
        if (taskTag) {
            tasks = await this.service.db.taskModel.find({ active: true, taskTag }).limit(10).exec();
        }
        else {
            tasks = await this.service.db.taskModel.find({ active: true }).limit(10).exec();
        }
        this.ctx.body = { ok: true, data: { tasks, banners, taskTags } };
    }
    async recruitStudent() {
        let { userId } = this.ctx.query;
        var user = await this.db.userModel.findById(userId).exec();
        let authUrl = await app_config_1.default.wxOauth.getOauthUrl('http://wq8.youqulexiang.com/wechat/oauth', { parent: userId });
        this.ctx.body = { ok: true, data: authUrl };
    }
    /**个人中心 */
    async personCenter() {
        /*
        let user = this.req.session.user;
        user = await this.service.db.userModel.findById(user._id.toString()).exec();

        console.log(user);
        this.res.render('share/person-center', {
            user
        });
        */
    }
    /**完善信息页面 */
    fullInfoPage() {
        /*郑州中原小香港”36栋楼被集中爆破“.html
        this.res.render('share/full-info')
        */
    }
    /**
     *
     * 提交表单
     */
    async fixFullInfo() {
        let { userId, phone, password } = this.ctx.request.body;
        let updateAction = await this.service.db.userModel.findByIdAndUpdate(userId, { phone, password, isFinish: true }).exec();
        this.ctx.body = { ok: true, data: updateAction };
    }
    async publishPage() {
        /*
        let taskTags = await this.service.db.taskTagModel.find().exec();
        this.res.render('share/publish', { taskTags })
        */
    }
    /**商户中心 */
    async advertInfo() {
        var tasks = await this.service.db.taskModel.find({ publisher: this.ctx.query._id.toString() }).exec();
        let activeNum = tasks.filter(task => task.active).length;
        var totalClickNum = 0;
        var totalFee = 0;
        tasks.forEach(task => {
            totalClickNum += task.clickNum || 0;
            totalFee += task.totalMoney || 0;
        });
        this.ctx.body = {
            allTaskNum: tasks.length,
            activeNum,
            totalClickNum,
            totalFee
        };
    }
    /**
     * 检查openid是否存在,若用户已经存在,则登陆,若用户不存在,则创建新用户
     * 若有上级parentId存在则作为用户的师傅
     */
    checkOpenIdExisit() {
    }
    async publishTask() {
        let { title, content, imageUrl, taskTag, shareMoney, fee, websiteUrl, publisher } = this.ctx.request.body;
        let newTask = await new this.service.db.taskModel({
            title,
            taskTag,
            content,
            imageUrl,
            fee,
            totalMoney: fee,
            shareMoney,
            websiteUrl,
            publisher, active: true, msg: '审核通过'
        }).save();
    }
    async payTaskMoney() {
        let ip = await this.service.tools.pureIp(this.ctx.request.ip);
        let { userId, fee } = this.ctx.request.body;
        let user = await this.db.userModel.findById(userId).exec();
        console.log(`ip:` + ip);
        var order = {
            body: '支付活动费用',
            spbill_create_ip: ip,
            openid: user.openid,
            trade_type: 'JSAPI',
            total_fee: fee * 100,
            attach: '任务费用',
            out_trade_no: 'hxz' + (+new Date),
        };
        let payargs = await app_config_1.default.wxPay.getBrandWCPayRequestParams({
            body: '支付活动费用',
            openid: user.openid,
            spbill_create_ip: ip,
            total_fee: fee * 100
        });
        if (payargs) {
            order['user'] = userId;
            let newRechgaregeRecord = await new this.db.wxRechargeRecordModel(order).save();
            this.ctx.body = { ok: true, data: payargs };
        }
        else {
            this.ctx.body = { ok: false, data: '微信支付失败,查找系统 shareRoute  payTaskMoney 错误' };
        }
    }
    /**
     * 三级分销
     *
     */
    async taskDetail() {
        let { taskId, userId } = this.ctx.request.body;
        let user = await this.db.userModel.findById(userId).exec();
        console.log('=========================返利接口=======================', user);
        // 如果是
        // 若不是注册的用户 , 则跳转到登陆页面, 并转载parent,taskId, 该用户会自动注册,拜师,然后返回这个任务做任务
        if (!user) {
            console.log('不是注册用户');
            // 重定向
            this.ctx.body = { ok: true, data: { valide: false, msg: '没有查找到用户' } };
        }
        else {
            console.log('是注册用户,开发返利');
            let task = await this.service.db.taskModel.findById(taskId).exec();
            // let user = await service.db.userModel.findById(userId).populate('parent').exec();;
            var isHaveVisited = task.users.some(visitedUser => {
                return user._id.toString() == visitedUser;
            });
            // 新的观看的人 
            if (!isHaveVisited) {
                console.log('新的观看的人');
                // 任务算新点击一次
                await task.update({ $inc: { clickNum: 1 } }).exec();
                // 任务 增加点击数量,ip访问数量,任务消耗数量, 
                /**
                 *
                 *
                 * 钱不够的情况下,不会有任何奖励,并且取消任务的活跃状态
                 */
                if (task.totalMoney - task.shareMoney < 0) {
                    await task.update({ $set: { active: false } }).exec();
                    console.log('钱不够');
                    this.ctx.body = { ok: true, data: { valide: false, msg: '钱不够' } };
                }
                else {
                    console.log('任务被点击一次');
                    //发布任务的人获得奖金 上级 5%   上上级 10% 上上上级 15%
                    var taskAllMoney = task.shareMoney;
                    if (user) {
                        //
                        console.log('有用户');
                        var parents = [];
                        /**
                         * 有师傅
                         */
                        if (user.parent) {
                            // 有师傅
                            console.log('第一位师傅id:', user.parent);
                            await user.populate('parent').execPopulate();
                            parents.push(user.parent);
                            if (user.parent) {
                                console.log('第二级师傅id:', user.parent.parent);
                                await user.parent.populate('parent').execPopulate();
                                if (user.parent.parent) {
                                    parents.push(user.parent.parent);
                                }
                                if (user.parent.parent) {
                                    await user.parent.parent.execPopulate();
                                    if (user.parent.parent.parent) {
                                        console.log('第三为师傅id:', user.parent.parent);
                                        parents.push(user.parent.parent.parent);
                                    }
                                }
                            }
                        }
                        console.log(parents.length + '位师傅');
                        let taskRecord;
                        switch (parents.length) {
                            // 一个师傅都没有
                            case 0:
                                console.log('一个师傅都没有');
                                // await user.update({ $inc: { totalMoney: taskAllMoney, todayMoney: taskAllMoney, historyMoney: taskAllMoney } }).exec();
                                taskRecord = await this.service.dbDo.returnMoney([{ userId, money: 0, task: taskId }], 0);
                                break;
                            case 1://5%
                                console.log('一位师傅开始返利');
                                let firstParent = parents[0];
                                taskRecord = await this.service.dbDo.returnMoney([
                                    { userId: userId, money: 0, task: taskId },
                                    { userId: firstParent, money: taskAllMoney, task: taskId }
                                ], task.shareMoney);
                                await task.update({ $inc: { clickNum: 1 }, $push: { users: user._id.toString() }, $set: { totalMoney: task.totalMoney - task.shareMoney } }).exec();
                                break;
                            //两个师傅  5% 10%     本人 85%
                            case 2:
                                let oneParent = parents[0];
                                let twoParent = parents[1];
                                let oneMoney = 0.95 * taskAllMoney;
                                let twoMoney = 0.05 * taskAllMoney;
                                taskRecord = await this.service.dbDo.returnMoney([
                                    { money: 0, task: taskId, userId: userId },
                                    { money: oneMoney, task: taskId, userId: oneParent },
                                    { money: twoMoney, task: taskId, userId: twoParent },
                                ], task.shareMoney);
                                await task.update({ $inc: { clickNum: 1 }, $push: { users: user._id.toString() }, $set: { totalMoney: task.totalMoney - task.shareMoney } }).exec();
                                break;
                            case 3:
                                let iParent = parents[0];
                                let iiParent = parents[1];
                                let iiiParent = parents[2];
                                let iMoney = 0.85 * taskAllMoney;
                                let iiMoney = 0.10 * taskAllMoney;
                                let iiiMoney = 0.05 * taskAllMoney;
                                taskRecord = await this.service.dbDo.returnMoney([
                                    { task: taskId, userId, money: 0 },
                                    { task: taskId, userId: iParent, money: iMoney },
                                    { task: taskId, userId: iiParent, money: iiMoney },
                                    { task: taskId, userId: iiiParent, money: iiiMoney }
                                ], task.shareMoney);
                                await task.update({ $inc: { clickNum: 1 }, $push: { users: user._id.toString() }, $set: { totalMoney: task.totalMoney - task.shareMoney } }).exec();
                                break;
                        }
                        this.ctx.body = { ok: true, data: { valide: true, data: taskRecord } };
                    }
                    else {
                        this.ctx.body = { ok: false, data: '该用户不存在' };
                    }
                }
            }
            else {
                console.log('已经访问过了');
                this.ctx.body = {
                    ok: true, data: {
                        valide: false,
                        msg: '已经访问过'
                    }
                };
            }
        }
    }
    studentMoney() {
        /*
        var user = this.req.session.user;
        this.res.render('share/student-money', {
            user
        });
        */
    }
    async myMoney() {
        /*
        let user = await this.db.userModel.findById(this.req.session.user._id.toString());
        this.res.render('share/myMoney', { user });
        */
    }
    /**
     *
     *
     * 提现
     */
    async getMoney() {
        /*
        this.res.render('share/getMoney', { user: this.req.session.user });
        */
    }
    async getMoneyDo() {
        let { userId, money } = this.ctx.request.body;
        let user = await this.db.userModel.findById(userId).exec();
        if (user.todayGetMoneyCount >= 2) {
            this.ctx.body = { ok: false, data: '一天只能提现两次哦' };
        }
        else {
            if (typeof money == 'string')
                money = parseFloat(money);
            if (user) {
                if (user.totalMoney >= money) {
                    let result = await app_config_1.default.wxPay.payToOne({
                        partner_trade_no: new Date().getTime().toString(),
                        amount: money * 100,
                        openid: user.openid,
                        desc: '提现'
                    });
                    if (result.ok) {
                        let action = await this.db.userModel.findByIdAndUpdate(userId, { $inc: { totalMoney: -money, todayGetMoneyCount: 1 } }).exec();
                        // 请求,钱就会减少
                        let newRequest = await new this.db.getMoneyRequestModel({ user: userId, money }).save();
                        this.ctx.body = { ok: true, data: '提款成功' };
                    }
                    else {
                        this.ctx.body = { ok: false, msg: result.data };
                    }
                }
                else {
                    this.ctx.body = { ok: false, data: '用户金额不足' };
                }
            }
            else {
                this.ctx.body = { ok: false, data: '用户不存在' };
            }
        }
    }
    async guide() {
        /*
        this.res.render('share/guide', {})
        */
    }
    /**钱的记录 */
    async getMoneyRecord() {
        let getMoneyRecords = await this.db.getMoneyRequestModel.find({ user: this.ctx.query.userId }).exec();
        this.ctx.body = { ok: true, data: getMoneyRecords };
    }
    async moneyLog() {
        /*
        let now = new Date().getTime();
        let before24h = now - 24 * 60 * 60 * 1000;
        let taskRecords = await this.db.taskRecordModel
            .find({ 'shareDetail.user': { $in: [this.req.session.user._id.toString()] } })
            .where('createDt').gt(before24h).lt(now).sort({ createDt: -1 }).populate('task').exec();
 
        this.res.render('share/money-log', { taskRecords });
        */
    }
};
default_1 = __decorate([
    lib_1.Core.Route.Controller({
        service: 'share',
    })
], default_1);
exports.default = default_1;
