import path = require('path');
import fs = require('fs');
import { WechatOauth, WechatPay, WechatApi, AliDaYuMessage, Qrcode } from './lib';





export default new class {
    adverster = {

    };
    //随机字符串
    randomStr = 'random';
    /**
     * 商户名称
     */
    wechatName = '武汉铭禄科技有限公司';
    oldAuth = 'shop.xxbuy.net';
    uploadDir = path.resolve(__dirname, '../pppp/upload');
    newAuth = '';
    domain = 'http://wq8.youqulexiang.com';
    oauthPath = '/wechat/oauth';
    IP = 'http://47.92.87.28';

    wechatPay = {
        partnerKey: "minglu12minglu12minglu12minglu12",
        appId: 'wx6e2bbf6aa4e95bd5',
        mchId: "1447732502",
        notifyUrl: "http://wq8.youqulexiang.com/payment/",
        pfx: fs.readFileSync(path.resolve(__dirname, '../temp/apiclient_cert.p12'))
    };
    wechatPayment = {
        appid: 'wx6e2bbf6aa4e95bd5',
        mch_id: '1447732502',
        apiKey: 'minglu12minglu12minglu12minglu12', //微信商户平台API密钥 
        notify_url: 'http://ml.henxiangzhuan.com/payment/',
        trade_type: 'APP', //APP, JSAPI, NATIVE etc. 
        pfx: fs.readFileSync(path.resolve(__dirname, '../temp/apiclient_cert.p12')) //微信商户平台证书 (optional，部分API需要使用) 
    };
    servicePayment = {
        much_appId: '1487270612',
    };
    jssdk = {
        "wechatToken": "sbnEzLbl77Gqnovb7Gqljj7TqYbRPprR",
        "appId": "wx07a1ef24ca488840",
        "appSecret": "bad732da8908a9764cc608438403e3b4",
    };
    // wechatClient: ''
    // 静态文件服务器
    publicDirs = [path.resolve(__dirname, '../public')]
    port = 81;
    wechat = {
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
    alidayuConfig = {
        accessKeyId: 'LTAIc52pztIgDWpZ',
        secretAccessKey: 't65RAKmNeP5k8SjIkB3mnnVyYxNIbW'
    }

    alidayu = new AliDaYuMessage(this.alidayuConfig.accessKeyId, this.alidayuConfig.secretAccessKey);



    /**
     * 
     * 微信授权登陆 
     * 具体使用方法看类说明
     */
    public wxOauth = new WechatOauth(this.wechat.appid, this.wechat.appsecret);
    public wxPay = new WechatPay({
        apiKey: this.wechat.apiKey,
        appid: this.wechat.appid,
        trade_type: 'APP',
        notify_url: this.wechat.notifyUrl,
        mch_id: this.wechat.mchId,
        pfx: this.wechat.pfx
    });
    public wxApi = new WechatApi(this.wechat.appid, this.wechat.appsecret);
    public picture = new Qrcode();


}





Object.seal(exports.default)