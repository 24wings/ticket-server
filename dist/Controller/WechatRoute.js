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
    constructor() { super(); }
    doAction(action, method, next) {
        switch (action) {
            // case 'oauth': return this.oauth;
            case 'jssdk': return this.getJSSDKSignature;
            case 'create-menu': return this.createMenu;
            case 'remove-menu': return this.removeMenu;
            case 'accessToken': return this.accessToken;
            case 'ticket': return this.ticket;
            case 'oauthUrl': return this.oauthUrl;
            default: return this.getJSSDKSignature;
        }
    }
    async oauthUrl(ctx, next) {
        // let url = await config.wxOauth.getOauthUrl(`http://ml.henxiangzhuan.com`, {});
        var url = app_config_1.default.wxOauth.getOauthUrl('http://ml.youqulexiang.com/wechat/oauth', '', 'snsapi_userinfo');
        ctx.body = { ok: true, data: url };
    }
    async before() { await this.next(); }
    after() { }
    /**创建微信公众号按钮 */
    async createMenu() {
        let action = await app_config_1.default.wxApi.api.createMenu({
            "button": [
                {
                    "type": "view",
                    "name": "视频介绍",
                    "url": "http://yuntv.letv.com/bcloud.html?uu=7ddc155d09&vu=b3c0457f85&auto_play=1"
                },
                {
                    "type": "view",
                    "name": "商城",
                    "url": "http://mp.weixin.qq.com/bizmall/mallshelf?id=&t=mall/list&biz=MzI4NDc5OTEzMA==&shelf_id=1&showwxpaytitle=1#wechat_redirect",
                },
                {
                    "type": "view",
                    "name": "狠享赚",
                    "url": "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx8bdcc982b8477839&redirect_uri=http%3A%2F%2Fwq8.youqulexiang.com%2Fwechat%2Foauth&response_type=code&scope=snsapi_userinfo&state=#wechat_redirect"
                    //https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx6e2bbf6aa4e95bd5&redirect_uri=http%3A%2F%2Fml.youqulexiang.com%2Fwechat%2Foauth&response_type=code&scope=snsapi_userinfo&state=snsapi_userinfo#wechat_redirect
                }
            ]
        });
        this.ctx.body = { ok: true, data: action };
    }
    async accessToken() {
        let token = await app_config_1.default.wxApi.getAccessToken();
        this.ctx.body = { ok: true, data: token };
    }
    async ticket() {
        let ticket = await app_config_1.default.wxApi.getTicket();
        this.ctx.body = { ok: true, data: ticket };
    }
    async removeMenu() {
        let action = await app_config_1.default.wxApi.api.removeMenu();
        this.ctx.body = { ok: true, data: action };
    }
    /*
    async payment() {
        let money = this.ctx.request.body;
        let ip = this.service.tools.pureIp(this.req.ip);
        var payargs = await this.service.wechat.wechatReturnMoney({
            attach: '',
            spbill_create_ip: ip,
            out_trade_no: '' + new Date().toString(),
            trade_type: 'JSAPI',
            openid: this.req.session.user.openid,
            body: '',
            total_fee: money
        });
        this.ctx.body=payargs;
    }
    */
    async oauth() {
        let { code, parent, taskId } = this.ctx.query;
        /**获取用户的openid **/
        let token = await app_config_1.default.wxOauth.getAccessToken(code);
        let user = await this.db.userModel.findOne({ openid: token.openid }).exec();
        if (user) {
            await user.update({ access_token: token.access_token }).exec();
        }
        else {
            let newUser = await app_config_1.default.wxOauth.getUserByTokenAndOpenId(token.access_token, token.openid);
            // newUser.accessToken = token.access_token;
            if (parent) {
                // newUser.parent = parent;
                console.log('新用户的师傅是' + parent);
                await this.db.userModel.findByIdAndUpdate(parent, { $inc: { todayStudent: 1, totalStudent: 1 } }).exec();
            }
            else {
                console.log('新用户没有师傅');
            }
            user = await new this.db.userModel(newUser).save();
        }
        ;
        if (taskId) {
            this.ctx.redirect('/share/taskDetail?taskId=' + taskId);
        }
        else {
            this.ctx.redirect('/share/index?openid=' + token.openid);
        }
    }
    /*
    oldOauth() {
        var code = this.req.query.code;
        var parent = this.req.query.parent;
        var taskId = this.req.query.taskId;
        // console.log(this.req.query, code);

        this.service.wechat.client.getAccessToken(code, (err, result) => {

            var accessToken = result.data.access_token;
            var openid = result.data.openid;
            this.req.session.accessToken = accessToken;
            this.res.locals.accessToken = accessToken;
            this.service.wechat.client.getUser(openid, async (err, result) => {
                let user = await this.service.db.userModel.findOne({ openid }).exec();
                if (user) {
                    await user.update({ accessToken }).exec();
                } else {
                    result.accessToken = accessToken;
                    if (parent) {
                        result.parent = parent;
                        console.log('新用户的师傅是' + parent);
                        await this.db.userModel.findByIdAndUpdate(parent, { $inc: { todayStudent: 1, totalStudent: 1 } }).exec();
                    } else {
                        console.log('新用户没有师傅')
                    }
                    user = await new this.db.userModel(result).save();
                }
                this.req.session.user = user;
                this.res.locals.user = user;

                if (taskId) {
                    this.res.redirect(`/share/detail?taskId=${taskId}`)

                } else {
                    this.res.redirect('/share/index?openid=' + openid);
                }
            });
        }, (err, result) => {
        });

    }
    notFound() {
        this.res.render('error')
    }
    */
    async getJSSDKSignature() {
        let jssdk = await app_config_1.default.wxApi.jssdk({
            url: //'http://wq8.youqulexiang.com/share/taskDetail'
            this.ctx.request.body.url
        });
        console.log('jssdk:url', this.ctx.request.body.url);
        console.log('jssdk:href', this.ctx.href);
        this.ctx.body = { ok: true, data: jssdk };
    }
};
default_1 = __decorate([
    lib_1.Core.Route.Controller({
        service: 'wechat'
    })
], default_1);
exports.default = default_1;
