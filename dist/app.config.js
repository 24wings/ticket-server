"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const fs = require("fs");
const lib_1 = require("./lib");
exports.default = new class {
    constructor() {
        this.adverster = {};
        //随机字符串
        this.randomStr = 'random';
        /**
         * 商户名称
         */
        this.wechatName = '武汉铭禄科技有限公司';
        this.oldAuth = 'shop.xxbuy.net';
        this.uploadDir = path.resolve(__dirname, '../pppp/upload');
        this.newAuth = '';
        this.domain = 'http://wq8.youqulexiang.com';
        this.oauthPath = '/wechat/oauth';
        this.IP = 'http://47.92.87.28';
        this.wechatPay = {
            partnerKey: "minglu12minglu12minglu12minglu12",
            appId: 'wx6e2bbf6aa4e95bd5',
            mchId: "1447732502",
            notifyUrl: "http://wq8.youqulexiang.com/payment/",
            pfx: fs.readFileSync(path.resolve(__dirname, '../temp/apiclient_cert.p12'))
        };
        this.wechatPayment = {
            appid: 'wx6e2bbf6aa4e95bd5',
            mch_id: '1447732502',
            apiKey: 'minglu12minglu12minglu12minglu12',
            notify_url: 'http://ml.henxiangzhuan.com/payment/',
            trade_type: 'APP',
            pfx: fs.readFileSync(path.resolve(__dirname, '../temp/apiclient_cert.p12')) //微信商户平台证书 (optional，部分API需要使用) 
        };
        this.servicePayment = {
            much_appId: '1487270612',
        };
        this.jssdk = {
            "wechatToken": "sbnEzLbl77Gqnovb7Gqljj7TqYbRPprR",
            "appId": "wx07a1ef24ca488840",
            "appSecret": "bad732da8908a9764cc608438403e3b4",
        };
        // wechatClient: ''
        // 静态文件服务器
        this.publicDirs = [path.resolve(__dirname, '../public')];
        this.port = 81;
        this.wechat = {
            appid: 'wx6e2bbf6aa4e95bd5',
            token: 'sbnEzLbl77Gqnovb7Gqljj7TqYbRPprR',
            appsecret: 'bad732da8908a9764cc608438403e3b4',
            encodingAESKey: '36HvJxirYdijH68yDAYps1Htw3zunBk9fFIJAnbEkIj',
            checkSignature: true,
            apiKey: 'minglu12minglu12minglu12minglu12',
            notifyUrl: "http://ml.youqulexiang.com/payment/",
            mchId: "1487270612",
            pfx: fs.readFileSync(path.resolve(__dirname, '../temp/apiclient_cert.p12'))
        };
        this.alidayuConfig = {
            accessKeyId: 'LTAIc52pztIgDWpZ',
            secretAccessKey: 't65RAKmNeP5k8SjIkB3mnnVyYxNIbW'
        };
        this.alidayu = new lib_1.AliDaYuMessage(this.alidayuConfig.accessKeyId, this.alidayuConfig.secretAccessKey);
        /**
         *
         * 微信授权登陆
         * 具体使用方法看类说明
         */
        this.wxOauth = new lib_1.WechatOauth(this.wechat.appid, this.wechat.appsecret);
        this.wxPay = new lib_1.WechatPay({
            apiKey: this.wechat.apiKey,
            appid: this.wechat.appid,
            trade_type: 'APP',
            notify_url: this.wechat.notifyUrl,
            mch_id: this.wechat.mchId,
            pfx: this.wechat.pfx
        });
        this.wxApi = new lib_1.WechatApi(this.wechat.appid, this.wechat.appsecret);
        this.picture = new lib_1.Qrcode();
    }
};
Object.seal(exports.default);
