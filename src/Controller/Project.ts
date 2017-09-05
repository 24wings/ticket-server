import { Core } from '../lib';
import path = require('path');
import config from '../app.config';
import fs = require('fs');
import { ITaskRecord } from '../models/TaskRecord';
@Core.Route.Controller({
    service: 'project',

})
export default class extends Core.Route.BaseRoute implements Core.Route.IRoute {

    doAction(action: string, method: string, next) {
        switch (action) {
            case 'login': return this.login;
            case 'projectList': return this.projectList;
            case 'projectInfo': return this.projectInfo;
            case 'addIssue': return this.addIssue;
            case 'deleteIssueById': return this.deleteIssueById;
            case 'updateIssue': return this.updateIssue;
            default: return this.login;
        }
    }
    async updateIssue() {
        let { _id } = this.ctx.query;
        let updateAction = await this.db.issueModel.findByIdAndUpdate(_id, this.ctx.request.body).exec();
        this.ctx.body = { ok: true, data: updateAction };
    }
    async deleteIssueById() {
        let { _id } = this.ctx.query;
        let delAction = await this.db.issueModel.findByIdAndRemove(_id).exec();
        this.ctx.body = { ok: true, data: delAction }
    }
    async addIssue() {
        let newIssue = await new this.db.issueModel(this.ctx.request.body).save();
        this.ctx.body = { ok: true, data: newIssue };
    }

    async projectInfo() {
        let { projectId } = this.ctx.query;
        let project = await this.db.projectModel.findById(projectId).populate('manages testers').exec();
        let issues = await this.db.issueModel.find({ project: projectId }).populate('publisher resolver').exec();
        this.ctx.body = { ok: true, data: { project, issues } };
    }

    // 弹出 项目人员和测试人员
    async projectList() {
        let projects = await this.db.projectModel.find().populate('manages testers').exec();
        this.ctx.body = { ok: true, data: projects };
    }
    async before() {
        await this.next()

    }

    after() {

    }

    async login() {
        let { phone, password } = this.ctx.request.body;
        let employee = await this.db.employeeModel.findOne({ phone, password }).exec();
        this.ctx.body = { ok: !!employee, data: employee ? employee : '用户名或者密码错误' };

    }
} 