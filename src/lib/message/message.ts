export interface Message {
    authCode: (phone) => Promise<string>;
    // 返回是否发送成功
    message: (phone, message) => Promise<boolean>;

}


export class AliDaYuMessage {

}