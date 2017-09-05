"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// //阿里大于发送短信验证码
const message_1 = require("./message");
class AliDaYuMessage {
    async authCode(PhoneNumbers, template, SignName = '狠享赚', TemplateCode = 'SMS_85215005') {
        console.log('短信验证:', PhoneNumbers);
        return new Promise(async (resolve, reject) => {
            if (!template) {
                let time = new Date().getTime().toString();
                let Code = time.substring(time.length - 6, time.length);
                template = { Code, product: '狠享赚' };
            }
            let result = await this.smsClient.sendSMS({ PhoneNumbers, SignName, TemplateCode, TemplateParam: JSON.stringify(template) });
            let { Code } = result;
            if (Code === 'OK') {
                //处理返回参数
                resolve(result);
            }
        });
    }
    async message(phone, message) {
        if ({ phone, message }) {
        }
        else {
        }
        return true;
    }
    constructor(accessKeyId, secretAccessKey) {
        this.smsClient = new message_1.SMSClient({ accessKeyId, secretAccessKey });
    }
    /**返回短信数组 */
    queryCode(phone) {
        //查询短信发送详情
        return new Promise(resolve => {
            let now = new Date();
            let SendDate = `${now.getFullYear()}${(now.getMonth() + 1).toString().length == 1 ? '0' + (now.getMonth() + 1).toString() : (now.getMonth() + 1).toString()}${now.getDate()}`;
            console.log(SendDate);
            this.smsClient.queryDetail({
                PhoneNumber: phone,
                SendDate,
                PageSize: '100',
                CurrentPage: "0"
            }).then(function (res) {
                let { Code, SmsSendDetailDTOs } = res;
                if (Code === 'OK') {
                    //处理发送详情内容
                    resolve(SmsSendDetailDTOs.SmsSendDetailDTO);
                }
            }, function (err) {
                //处理错误
                resolve();
            });
        });
    }
}
exports.AliDaYuMessage = AliDaYuMessage;
