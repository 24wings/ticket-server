"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const lib_1 = require("../lib");
let default_1 = class extends lib_1.Core.Route.BaseRoute {
    doAction(action, method, next) {
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
        this.ctx.body = { ok: true, data: delAction };
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
        await this.next();
    }
    after() {
    }
    async login() {
        let { phone, password } = this.ctx.request.body;
        let employee = await this.db.employeeModel.findOne({ phone, password }).exec();
        this.ctx.body = { ok: !!employee, data: employee ? employee : '用户名或者密码错误' };
    }
};
default_1 = __decorate([
    lib_1.Core.Route.Controller({
        service: 'project',
    })
], default_1);
exports.default = default_1;
