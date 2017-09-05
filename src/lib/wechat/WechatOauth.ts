import tool from './WechatTool';
import querystring = require('querystring');
import fs = require('fs');
import path = require('path');

interface AccessToken {
    access_token: string;
    expires_in: number;
    refresh_token: string;
    openid: string;
    scope: string;
}

/**
 * 
 * 微信授权登陆类
 */
export default class {
    private URL: {
        /** https://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1421140842  首先请注意，这里通过code换取的是一个特殊的网页授权access_token,与基础支持中的access_token（该access_token用于调用其他接口）不同。*/
        access_token: 'https://api.weixin.qq.com/sns/oauth2/access_token',//?appid=APPID&secret=SECRET&code=CODE&grant_type=authorization_code
        refersh_token: 'https://api.weixin.qq.com/sns/oauth2/refresh_token?', //appid=APPID&grant_type=refresh_token&refresh_token=REFRESH_TOKEN 
        getUser: 'https://api.weixin.qq.com/sns/userinfo',//?access_token=ACCESS_TOKEN&openid=OPENID&lang=zh_CN'
    }
    /**
     * 返回Oauth验证Url .可额外附加重定向后的参数
     */
    getOauthUrl(redirect: string, queryObj?: Object, state = '', scope = 'snsapi_userinfo') {
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

        return tool.urls.oauth.auth + '?' + querystring.stringify(info) + '#wechat_redirect';
    }
    private tokenPath = path.resolve(__dirname, '../../../temp/access_token')



    /**
     * { "access_token":"ACCESS_TOKEN",    
 "expires_in":7200,    
 "refresh_token":"REFRESH_TOKEN",    
 "openid":"OPENID",    
 "scope":"SCOPE" } 

 自动缓存 accessToken
     */


    async getAccessToken(code: string): Promise<AccessToken> {
        console.log('code:', code);

        let result = await tool.httpsGet(`https://api.weixin.qq.com/sns/oauth2/access_token` + `?code=${code}&appid=${this.appid}&secret=${this.appscrent}&grant_type=authorization_code`);
        let obj: AccessToken = JSON.parse(result);
        // await this.saveAccessTokenToFile(obj.openid, obj);
        return obj;
    }


    // 如果没有获得新用户就掠过请求
    async getUserByTokenAndOpenId(access_token: string, openid: string): Promise<{ ok: boolean, user: any }> {
        let url = `https://api.weixin.qq.com/sns/userinfo?access_token=${access_token}&openid=${openid}&lang=zh_CN`;
        console.warn('url:', url);
        let userStr = await tool.httpsGet(url);
        let user = JSON.parse(userStr);
        console.log(user);
        // errcode: 40001,第二次的使code失效
        if (user.errcode) {
            return { ok: false, user };
        } else {

            return { ok: true, user };

        }
    }

    getAccessTokenFromFile(openid: string): Promise<AccessToken> {
        return new Promise((resolve, reject) => {
            fs.readFile(this.tokenPath + '/' + openid, 'utf-8', (err, data) => {
                if (err) console.error(err);
                resolve(JSON.parse(data));
            })
        });

    }

    saveAccessTokenToFile(openid: string, token: AccessToken) {
        return new Promise((resolve, reject) => {
            fs.writeFile(this.tokenPath + '/' + token.openid, JSON.stringify(token), (data) => {
                resolve(data)
            })
        });

    }

    async getRerfershToken() {
        //https://api.weixin.qq.com/sns/oauth2/refresh_token?appid=APPID&grant_type=refresh_token&refresh_token=REFRESH_TOKEN 
    }

    constructor(public appid: string, public appscrent) { }


}