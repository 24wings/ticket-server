"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const service = require("../../services");
const fs = require("fs");
const path = require("path");
exports.VIEWPATH = Symbol('VIEWPATH');
exports.SERVICEPATH = Symbol('SERVICEPATH');
exports.CHECKQUERY = Symbol('CHECKQUERY');
exports.CHECKBODY = Symbol('CHECKBODY');
/**
 *
 * 装饰器
 * 如 @Views('project-manage-admin')
 * 在 ProjectManageAdmin上后,调用 this.render('index')自动渲染视图文件夹views下的project-manage-admin/index.html
 *
 *
 */
var Core;
(function (Core) {
    let Route;
    (function (Route) {
        function Controller(config) {
            return (target) => {
                target.prototype[exports.SERVICEPATH] = config.service;
            };
        }
        Route.Controller = Controller;
        class RouteBuilder {
            /**
             *
             * 构建路由
             */
            static addRoute(routeClass) {
                let service = routeClass.prototype[exports.SERVICEPATH];
                if (this.route.get(service)) {
                    throw Error('重复添加路由器' + service);
                }
                else {
                    let routeObj = new routeClass();
                    this.route.set(service, routeObj);
                    console.log('添加路由', service);
                }
                // RouteBuilder.route[SERVICEPATH] = new routeClass();
                // this.route.get()
                return this.route;
            }
            static getRoute() {
                var ctrl = { service: service, db: service.db };
                return [
                    //before
                    async (ctx, next) => {
                        let routeObj = this.route.get(ctx.params.service);
                        if (routeObj) {
                            console.log(`
                                service:${ctx.params.service}
                                action:${ctx.params.action}       
                                `);
                            // console.log(routeObj);
                            let temp = Object.assign({}, ctrl, { ctx, next });
                            await routeObj.before.bind(temp)(ctx, next);
                        }
                        else {
                            throw Error('路由不存在');
                        }
                    }, async (ctx, next) => {
                        let routeObj = this.route.get(ctx.params.service);
                        if (routeObj) {
                            // 参数检验
                            let temp = Object.assign({}, ctrl, {
                                ctx,
                                next,
                            });
                            await routeObj.doAction(ctx.params.action, ctx.method.toLowerCase(), next).bind(temp)(ctx, next);
                        }
                        else {
                            throw Error('路由不存在');
                        }
                    },
                    async (ctx, next) => {
                        let routeObj = this.route.get(ctx.params.service);
                        if (routeObj) {
                            let temp = Object.assign({}, ctrl, { ctx, next });
                            await routeObj.after.bind(temp)(ctx, next);
                        }
                        else {
                            throw Error('路由不存在');
                        }
                    }
                ];
            }
            static scannerRoutes(dirPath) {
                let state = fs.lstatSync(dirPath);
                if (state.isDirectory()) {
                    let files = fs.readdirSync(dirPath);
                    files.forEach(filename => {
                        let aboFile = path.resolve(dirPath, filename);
                        let relative = path.relative(__dirname, aboFile);
                        relative = relative.replace(/\\/g, '/');
                        let routePath = './' + relative;
                        console.log('路由文件:', routePath);
                        let routeClass = require(routePath).default;
                        this.addRoute(routeClass);
                    });
                    return this.getRoute();
                }
                else {
                    throw Error('please input a  directiory to be a scannerRoute Directory');
                }
            }
        }
        RouteBuilder.route = new Map();
        Route.RouteBuilder = RouteBuilder;
        class BaseRoute extends Object {
            constructor() {
                super();
                this.service = service;
                this.db = service.db;
                delete this.service;
                delete this.db;
            }
            doAction(action, method, next) {
                return next;
            }
        }
        Route.BaseRoute = BaseRoute;
    })(Route = Core.Route || (Core.Route = {}));
    let Check;
    (function (Check) {
        function Query(key) {
            return (target, propertyKey, descriptor) => {
                let method = target[propertyKey];
                method.prototype[exports.CHECKQUERY] = key;
            };
        }
        Check.Query = Query;
        function Body() {
        }
        Check.Body = Body;
    })(Check = Core.Check || (Core.Check = {}));
})(Core = exports.Core || (exports.Core = {}));
