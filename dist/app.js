"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const koa = require("koa");
const fs = require("fs");
const service = require("./services");
const Router = require("koa-router");
const staticServer = require("koa-static");
const bodyparser = require("koa-bodyparser");
const path = require("path");
const compress = require("koa-compress");
const lib_1 = require("./lib");
const moment = require("moment");
const app_config_1 = require("./app.config");
const models_1 = require("./models");
const views = require("koa-views");
var app = new koa();
let routes = lib_1.Core.Route.RouteBuilder.scannerRoutes(path.resolve(__dirname, './Controller'));
let router = new Router();
var OAuth = require('wechat-oauth');
var client = new OAuth(app_config_1.default.wechat.appid, app_config_1.default.wechat.appsecret);
var filters = {
    time: (date) => moment(date).format('YYYY-MM-DD'),
    json: (obj) => JSON.stringify(obj),
    money: (money) => { if (typeof money == 'string')
        money = parseFloat(money); return money.toFixed(2); },
    boolean: (ok) => !!ok,
    myFault: (ok) => !ok
};
router.all('/:service.:action.go', ...routes)
    .get('/', async (ctx, next) => {
    let { taskTag } = ctx.query;
    let tasks = [];
    let banners = await service.db.bannerModel.find({ active: true }).populate('task').exec();
    let taskTags = await service.db.taskTagModel.find().exec();
    if (taskTag) {
        tasks = await service.db.taskModel.find({ active: true, taskTag }).limit(10).exec();
    }
    else {
        tasks = await service.db.taskModel.find({ active: true }).limit(10).exec();
    }
    await ctx.render('share/index', { tasks, taskTag });
})
    .get('/share/:action', async (ctx, next) => {
    let { parent, taskId } = ctx.query;
    if (parent && ctx.params.action == 'taskDetail') {
        let url = await app_config_1.default.wxOauth.getOauthUrl(`http://ml.youqulexiang.com.com/wechat/oauth`, { parent, taskId });
        console.log('重定向=====> share-detail:', url);
        await ctx.redirect(url);
    }
    else if (ctx.params.action == 'taskDetail') {
        let task = await models_1.db.taskModel.findById(taskId).exec();
        await ctx.render('share/taskDetail', { task });
    }
    else {
        let { taskTag } = ctx.query;
        let tasks = [];
        let banners = await service.db.bannerModel.find({ active: true }).populate('task').exec();
        let taskTags = await service.db.taskTagModel.find().exec();
        if (taskTag) {
            tasks = await service.db.taskModel.find({ active: true, taskTag }).limit(10).exec();
        }
        else {
            tasks = await service.db.taskModel.find({ active: true }).limit(10).exec();
        }
        await ctx.render('share/index', { tasks, taskTag, taskTags });
    }
})
    .get('/advert/:action', async (ctx, next) => {
    await ctx.render('advert/index');
})
    .get('/admin/:action', async (ctx, next) => {
    let html = await new Promise(async (resolve, reject) => {
        fs.readFile(path.resolve(__dirname, '../admin/admin/index.html'), 'utf-8', (err, data) => {
            if (err)
                console.error(data);
            resolve(data);
        });
    });
    ctx.body = html;
})
    .get('/login', async (ctx, next) => {
    let html = await new Promise(async (resolve, reject) => {
        fs.readFile(path.resolve(__dirname, '../advert/advert/index.html'), 'utf-8', (err, data) => {
            if (err)
                console.error(data);
            resolve(data);
        });
    });
    ctx.body = html;
});
router.get('/wechat/oauth', async (ctx, next) => {
    let { code, parent, taskId } = ctx.query;
    console.log(`query:`, ctx.query);
    // *获取用户的openid 
    let token = await app_config_1.default.wxOauth.getAccessToken(code);
    console.log('token:', token);
    let tokenUser = await app_config_1.default.wxOauth.getUserByTokenAndOpenId(token.access_token, token.openid);
    if (tokenUser.ok) {
        let user = await service.db.userModel.findOne({ openid: token.openid }).exec();
        console.log('查找用户', !!user, user);
        if (user) {
            await user.update({ access_token: token.access_token }).exec();
            if (taskId) {
                ctx.redirect(`/share/taskDetail?taskId=${taskId}&shareUserId=${user._id}`);
            }
            else {
                ctx.redirect(`/share/index?openid=` + token.openid);
            }
        }
        else {
            if (parent) {
                tokenUser.user.parent = parent;
                await service.db.userModel.findByIdAndUpdate(parent, { $inc: { todayStudent: 1, totalStudent: 1 } }).exec();
            }
            else {
                console.log('新用户没有师傅');
            }
            // console.log('新用户的师傅是' + parentUser);
            console.log('创建新用户', tokenUser);
            let saveUser = await new service.db.userModel(tokenUser.user).save();
            if (taskId) {
                console.log('重定向===================>openid', taskId);
                ctx.redirect(`/share/taskDetail?taskId=${taskId}&shareUserId=${saveUser._id}`);
            }
            else {
                console.log('重定向===================>openid', token.openid);
                ctx.redirect('/share/index?openid=' + token.openid);
            }
        }
        ;
    }
    else {
        console.log('失效的微信token', tokenUser.user);
        ctx.body = { ok: false, data: '微信token失效' };
    }
});
let server = app
    .use(views(path.resolve(__dirname, '../views'), { map: { html: 'swig' } }))
    .use(async (ctx, next) => {
    ctx.set("Access-Control-Allow-Origin", "*");
    ctx.set("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
    ctx.set("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    ctx.set("X-Powered-By", ' 3.2.1');
    if (ctx.method == "OPTIONS")
        ctx.body = 200;
    else {
        await next();
    }
})
    .use(compress({
    filter: function (content_type) {
        return /.js$/i.test(content_type) || /.css$/i.test(content_type);
    },
    threshold: 2048,
    flush: require('zlib').Z_SYNC_FLUSH
}))
    .use(async (ctx, next) => {
    let start = new Date().getTime();
    await next();
    let time = new Date().getTime() - start;
    ctx.set('x-response-time', time + 'ms');
    console.log(`${ctx.method}   ${ctx.url}  ${time}ms`);
})
    .use(staticServer(path.resolve(__dirname, '../public')))
    .use(staticServer(path.resolve(__dirname, '../pppp')))
    .use(staticServer(path.resolve(__dirname, '../advert')))
    .use(staticServer(path.resolve(__dirname, '../admin')))
    .use(bodyparser({ jsonLimit: '50mb', formLimit: '50mb' }))
    .use(router.routes())
    .use(router.allowedMethods());
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;
if (cluster.isMaster) {
    console.log(`Master ${process.pid} is running`);
    // Fork workers.
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }
    cluster.on('exit', (worker, code, signal) => {
        console.log(`worker ${worker.process.pid} died`);
    });
}
else {
    // Workers can share any TCP connection
    // In this case it is an HTTP server
    server.listen(80, () => {
        console.log('server is running on 80');
    });
    console.log(`Worker ${process.pid} started`);
}
