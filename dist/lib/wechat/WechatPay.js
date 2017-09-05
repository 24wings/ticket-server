"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const WechatTool_1 = require("./WechatTool");
const WechatTool_2 = require("./WechatTool");
const url = require("url");
const request = require("request");
const https = require("https");
class WechatPay {
    constructor(wechatConfig) {
        this.wechatConfig = wechatConfig;
    }
    /**
     * 商家支付到个人
     * @param order Object
     */
    payToOne(order) {
        return new Promise((resolve, reject) => {
            order.check_name = order.check_name ? order.check_name : 'NO_CHECK';
            order.spbill_create_ip = order.spbill_create_ip ? order.spbill_create_ip : WechatTool_1.default.getSelfIp();
            order.nonce_str = order.nonce_str ? order.nonce_str : WechatTool_2.default.getRadomStr();
            order.mch_appid = this.wechatConfig.appid;
            order.mchid = this.wechatConfig.mch_id;
            let sign = WechatTool_2.default.sign(order, this.wechatConfig.apiKey);
            order.sign = sign;
            let body = WechatTool_2.default.bulildXml({ xml: order });
            console.log(body);
            request(WechatTool_2.default.urls.transfers, {
                method: 'POST',
                body: body,
                agentOptions: {
                    pfx: this.wechatConfig.pfx,
                    passphrase: this.wechatConfig.mch_id
                }
            }, async (err, res, data) => {
                if (err)
                    console.error(err);
                // let result = wechatTool.parseXml(body);
                let json = await WechatTool_2.default.parseXml(data);
                console.log(json);
                let isSuccess = json.xml.result_code[0] == 'SUCCESS';
                data = isSuccess ? json.xml.partner_trade_no[0] : json.xml.err_code_des[0];
                resolve({ ok: isSuccess, data });
            });
        });
    }
    /**
     *  微信用户支付给公众号对工银行卡号
     *
     * [微信支付下单 服务器端](https://pay.weixin.qq.com/wiki/doc/api/jsapi.php?chapter=9_1)
     *
     * [微信支付请求参数](https://pay.weixin.qq.com/wiki/doc/api/jsapi.php?chapter=7_7&index=6)
     * 默认参数 trade_type: 'JSAPI'
     */
    async getBrandWCPayRequestParams(order) {
        return new Promise((resolve, reject) => {
            let options = {
                appid: this.wechatConfig.appid,
                mch_id: '1447627402' || this.wechatConfig.mch_id,
                // timeStamp: wechatTool.generateTimestamp(),
                nonce_str: WechatTool_2.default.getRadomStr(),
                body: order.body,
                openid: order.openid,
                out_trade_no: order.out_trade_no || new Date().getTime().toString(),
                total_fee: order.total_fee,
                spbill_create_ip: order.spbill_create_ip || WechatTool_2.default.getSelfIp(),
                notify_url: order.notify_url || this.wechatConfig.notify_url,
                trade_type: order.trade_type || 'JSAPI'
            };
            let sign = WechatTool_2.default.sign(options, this.wechatConfig.apiKey);
            options['sign'] = sign;
            let xml = WechatTool_2.default.bulildXml({ xml: options });
            console.log(xml);
            let parsed_url = url.parse(WechatTool_2.default.urls.PAY.UNIFIED_ORDER);
            let req = https.request({
                host: parsed_url.host,
                port: 443,
                path: parsed_url.path,
                pfx: this.wechatConfig.pfx,
                passphrase: this.wechatConfig['passphrase'] || this.wechatConfig.mch_id,
                method: 'POST',
            }, (res) => {
                var content = '';
                res.on('data', function (chunk) {
                    content += chunk;
                });
                res.on('end', async () => {
                    let jsonStr = await WechatTool_2.default.parseXml(content);
                    console.log(jsonStr);
                    let dt = new Date().getTime();
                    let payargs = {
                        appId: jsonStr.xml.appid[0],
                        nonceStr: options.nonce_str,
                        signType: 'MD5',
                        package: `prepay_id=${jsonStr.xml.prepay_id}`,
                        timeStamp: dt,
                    };
                    let paySign = WechatTool_2.default.sign(payargs, this.wechatConfig.apiKey);
                    payargs['paySign'] = paySign;
                    resolve(payargs);
                });
            });
            req.on('error', function (e) {
                resolve(e);
            });
            req.write(xml);
            req.end();
        });
        /*
        https.get(wechatTool.urls.PAY.UNIFIED_ORDER, {

            body: xml
        }), (err, res, body) => {
            if (err) console.error(err);
            resolve(body)
        }
        */
        // });
    }
}
exports.default = WechatPay;
