"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const WechatTool_1 = require("./WechatTool");
const crypto = require("crypto");
var WechatAPI = require('co-wechat-api');
async function test() {
}
/**
 * access_token官方文档    https://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1421140183
 */
class default_1 {
    constructor(appId, appSecrt) {
        this.appId = appId;
        this.appSecrt = appSecrt;
        //  result = await api.updateRemark('open_id', 'remarked');
        this.URLS = {
            //&appid=APPID&secret=APPSECRET
            accessToken: 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential',
            //access_token=ACCESS_TOKEN&type=jsapi
            ticket: 'https://api.weixin.qq.com/cgi-bin/ticket/getticket?type=jsapi'
        };
        //私有的token
        this.token = {
            access_token: '',
            expires_in: 0,
            lastModifyTime: 0
        };
        this.ticket = {
            ticket: '',
            expires_in: 0,
            lastModifyTime: 0
        };
        this.api = new WechatAPI(appId, appSecrt);
    }
    async createMenu(buttons) {
        let token = await this.getAccessToken();
        let content = await WechatTool_1.default.httpsPost({ href: `https://api.weixin.qq.com/cgi-bin/menu/create?access_token=${token}`, body: buttons });
        return content;
    }
    /**
     * noncestr=Wm3WZYTPz0wzccnW
        jsapi_ticket=sM4AOVdWfPE4DxkXGEs8VMCPGGVi4C3VM0P37wVUCFvkVAy_90u5h9nbSlYy3-Sl-HhTdfl2fzFy1AOcHKP7qg
        timestamp=1414587457
        url=http://mp.weixin.qq.com?params=value
     */
    async jssdk(opt) {
        if (!opt.jsapi_ticket) {
            opt.jsapi_ticket = await this.getTicket();
        }
        if (!opt.timestamp)
            opt.timestamp = parseInt(WechatTool_1.default.generateTimestamp());
        if (!opt.noncestr)
            opt.noncestr = await WechatTool_1.default.getRadomStr();
        let str = `jsapi_ticket=${opt.jsapi_ticket}&noncestr=${opt.noncestr}&timestamp=${opt.timestamp}&url=${opt.url}`;
        let sha1 = crypto.createHash('sha1');
        let sign = sha1.update(str).digest('hex');
        return {
            debug: false,
            appId: this.appId,
            timestamp: opt.timestamp,
            nonceStr: opt.noncestr,
            signature: sign,
        };
    }
    //若不传入token,则自动调用底层方法获取token,若传入token,则使用token
    async getTicket(token) {
        if (!this.isTicketValid) {
            if (!token) {
                token = await this.getAccessToken();
            }
            let ticketStr = await WechatTool_1.default.httpsGet(this.URLS.ticket + `&access_token=${token}`);
            let ticket = JSON.parse(ticketStr);
            this.ticket.ticket = ticket.ticket;
            this.ticket.expires_in = ticket.expires_in;
            this.ticket.lastModifyTime = new Date().getTime();
            console.log(ticket);
        }
        return this.ticket.ticket;
    }
    get isTicketValid() {
        return !!this.ticket.ticket && new Date().getTime() <= this.ticket.lastModifyTime + this.ticket.expires_in * 1000 && !!this.ticket.lastModifyTime;
    }
    get isTokenValid() {
        return !!this.token.access_token && new Date().getTime() <= this.token.lastModifyTime + this.token.expires_in * 1000 && !!this.token.lastModifyTime;
    }
    /**
     * 自动缓存access_token,开心大胆的用吧
     */
    async getAccessToken() {
        if (!this.isTokenValid) {
            let tokenStr = await WechatTool_1.default.httpsGet(`https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appId=${this.appId}&secret=${this.appSecrt}`);
            let token = JSON.parse(tokenStr);
            this.token.access_token = token.access_token;
            this.token.lastModifyTime = new Date().getTime();
            this.token.expires_in = parseInt(token.expires_in);
        }
        return this.token.access_token;
    }
}
exports.default = default_1;
