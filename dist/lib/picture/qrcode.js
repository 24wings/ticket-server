"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const qrcodeImage = require("qr-image");
class Qrcode {
    urlToQrcode(url, type = 'svg') {
        let result = qrcodeImage.imageSync(url, { type });
        if (type = 'png') {
            let base64 = result.toString('base64');
            console.log(base64);
            return base64;
        }
        else {
            return result;
        }
    }
}
exports.Qrcode = Qrcode;
