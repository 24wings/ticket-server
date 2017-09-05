import { Core } from '../lib';
import mongoose = require('mongoose');
import path = require('path');
import fs = require('fs');
import config from '../app.config';
import { db } from '../models';


export enum ActionType {
    FIND,
    UPDATE,
    NEW,
    DELETE
}

@Core.Route.Controller({
    service: 'api',
})
export default class extends Core.Route.BaseRoute implements Core.Route.IRoute {
    doAction(action: string, method: string, next) {
        switch (action) {
            case 'uploadBase64': return this.uploadBase64;
            case 'url2Qrcode': return this.url2Qrcode;
            case 'videoBase64': return this.videoBase64;
            case 'rest': return this.rest;
        }

    }

    async videoBase64() {

    }

    async  rest() {
        let { model, type, query, skip, limit, populate, sort, newObject } = this.ctx.request.body;
        let table: mongoose.Model<any> = <any>db[model];
        if (!model) {
            this.ctx.body = { ok: false, data: '不存在的查询' };
        } else {
            let data = [];
            switch (type) {
                case ActionType.FIND:
                    let findAction = table.find(query);
                    if (skip) findAction = findAction.skip(skip);
                    if (limit) findAction = findAction.limit(limit);
                    if (populate) findAction = findAction.populate(populate);
                    if (sort) findAction = findAction.sort(sort);
                    data = await findAction.exec();
                    this.ctx.body = { ok: true, data }
                    break;
                case ActionType.UPDATE:
                    let updateAction = await table.find(query).update(newObject);
                    this.ctx.body = { ok: true, data: updateAction };
                case ActionType.NEW:
                    let saveAction = await new table(newObject).save();
                    this.ctx.body = { ok: true, data: saveAction };
                    break;
                case ActionType.DELETE:
                    let delAction = await table.find(query).remove();
                    this.ctx.body = { ok: true, data: delAction };
                    break;
            }
        }

    }



    async url2Qrcode() {
        let { url, type } = this.ctx.request.body;
        if (!type) type = 'png';
        let base64 = await config.picture.urlToQrcode(url, type);
        base64 = 'data:image/png;base64,' + base64;
        this.ctx.body = { ok: true, data: base64, url };
    }
    async before() {
        await this.next()
    }
    after() { }

    index() {
        this.ctx.body = 'hello';
    }
    async  uploadBase64() {
        let base64 = this.ctx.request.body.base64;
        var ctrl = this;
        function uploadFile(file, filename) {
            return new Promise((resolve, reject) => {
                if (file.indexOf('base64,') != -1) {
                    file = file.substring(file.indexOf('base64,') + 7);
                }
                let randomFilename = new Date().getTime() + filename;
                let distpath = path.resolve(config.uploadDir + '/' + randomFilename);

                fs.writeFile(distpath, new Buffer(file, 'base64'), (err) => {
                    err ? resolve(false) : resolve('/upload/' + randomFilename);
                });
            })
        }
        let url = await uploadFile(base64, this.ctx.request.body.filename || 'test.png');
        console.log('上传图片:' + url);
        this.ctx.body = { ok: true, data: config.IP + url };

    }

} 