"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const WechatTool_1 = require("./WechatTool");
const querystring = require("querystring");
const fs = require("fs");
const path = require("path");
/**
 *
 * 微信授权登陆类
 */
class default_1 {
    constructor(appid, appscrent) {
        this.appid = appid;
        this.appscrent = appscrent;
        this.tokenPath = path.resolve(__dirname, '../../../temp/access_token');
    }
    /**
     * 返回Oauth验证Url .可额外附加重定向后的参数
     */
    getOauthUrl(redirect, queryObj, state = '', scope = 'snsapi_userinfo') {
        if (queryObj) {
            redirect = redirect + '?' + (queryObj ? querystring.stringify(queryObj) : '');
        }
        console.log('redirect:', redirect);
        let info = {
            appid: this.appid,
            redirect_uri: redirect,
            response_type: 'code',
            scope: scope,
            state: state,
        };
        return WechatTool_1.default.urls.oauth.auth + '?' + querystring.stringify(info) + '#wechat_redirect';
    }
    /**
     * { "access_token":"ACCESS_TOKEN",
 "expires_in":7200,
 "refresh_token":"REFRESH_TOKEN",
 "openid":"OPENID",
 "scope":"SCOPE" }

 自动缓存 accessToken
     */
    async getAccessToken(code) {
        console.log('code:', code);
        let result = await WechatTool_1.default.httpsGet(`https://api.weixin.qq.com/sns/oauth2/access_token` + `?code=${code}&appid=${this.appid}&secret=${this.appscrent}&grant_type=authorization_code`);
        let obj = JSON.parse(result);
        // await this.saveAccessTokenToFile(obj.openid, obj);
        return obj;
    }
    // 如果没有获得新用户就掠过请求
    async getUserByTokenAndOpenId(access_token, openid) {
        let url = `https://api.weixin.qq.com/sns/userinfo?access_token=${access_token}&openid=${openid}&lang=zh_CN`;
        console.warn('url:', url);
        let userStr = await WechatTool_1.default.httpsGet(url);
        let user = JSON.parse(userStr);
        console.log(user);
        // errcode: 40001,第二次的使code失效
        if (user.errcode) {
            return { ok: false, user };
        }
        else {
            return { ok: true, user };
        }
    }
    getAccessTokenFromFile(openid) {
        return new Promise((resolve, reject) => {
            fs.readFile(this.tokenPath + '/' + openid, 'utf-8', (err, data) => {
                if (err)
                    console.error(err);
                resolve(JSON.parse(data));
            });
        });
    }
    saveAccessTokenToFile(openid, token) {
        return new Promise((resolve, reject) => {
            fs.writeFile(this.tokenPath + '/' + token.openid, JSON.stringify(token), (data) => {
                resolve(data);
            });
        });
    }
    async getRerfershToken() {
        //https://api.weixin.qq.com/sns/oauth2/refresh_token?appid=APPID&grant_type=refresh_token&refresh_token=REFRESH_TOKEN 
    }
}
exports.default = default_1;
