// //阿里大于发送短信验证码
import { SMSClient } from './message';
// // ACCESS_KEY_ID/ACCESS_KEY_SECRET 根据实际申请的账号信息进行替换

//初始化sms_client

//发送短信
export interface Msg {
    SendDate: Date, SendStatus: number, ReceiveDate: Date, TemplateCode: string, Content: string, PhoneNum: String
}

//短信验证
export interface Message {
    authCode: (phone, template: { Code: string, product: string }, SignName: string, TemplateCode: string) => Promise<any>;
    // 返回是否发送成功
    message: (phone, message) => Promise<boolean>;

}


export class AliDaYuMessage implements Message {
    smsClient: SMSClient;

    async authCode(PhoneNumbers: string, template?: { Code: string, product: string }, SignName: string = '狠享赚', TemplateCode: string = 'SMS_85215005', ) {
        console.log('短信验证:', PhoneNumbers)
        return new Promise(async (resolve, reject) => {
            if (!template) {
                let time = new Date().getTime().toString();
                let Code = time.substring(time.length - 6, time.length);
                template = { Code, product: '狠享赚' }
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

        } else {

        }
        return true;
    }
    constructor(accessKeyId, secretAccessKey) {
        this.smsClient = new SMSClient({ accessKeyId, secretAccessKey });
    }
    /**返回短信数组 */
    queryCode(phone: string): Promise<Msg[]> {

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
                let { Code, SmsSendDetailDTOs } = res
                if (Code === 'OK') {
                    //处理发送详情内容
                    resolve(<Msg[]>SmsSendDetailDTOs.SmsSendDetailDTO);
                }
            }, function (err) {
                //处理错误
                resolve();
            });

        })
    }

}





