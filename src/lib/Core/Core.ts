import koa = require('koa');
import service = require('../../services');
import Router = require('koa-router');

import fs = require('fs');
import path = require('path');
export var VIEWPATH = Symbol('VIEWPATH');
export var SERVICEPATH = Symbol('SERVICEPATH');
export var CHECKQUERY = Symbol('CHECKQUERY');
export var CHECKBODY = Symbol('CHECKBODY');

/**
 * 
 * 装饰器
 * 如 @Views('project-manage-admin')　
 * 在 ProjectManageAdmin上后,调用 this.render('index')自动渲染视图文件夹views下的project-manage-admin/index.html
 * 
 * 
 */



export namespace Core {
    export namespace Route {

        export type Context = koa.Context;
        export type Middleware = koa.Middleware;
        export function Controller(config: {
            service: string
        }) {
            return (target: RouteClass) => {
                target.prototype[SERVICEPATH] = config.service
            };
        }
        export interface IRoute {
            ctx: Context;

            /**
             * 请求之前的中间件
             */
            before: Middleware;

            /**
             * 请求之后的中间件
             */
            after: Middleware;
            doAction: (action: string, method: string, next: Middleware) => Middleware;
        }


        export class RouteBuilder {

            static route = new Map<string, BaseRoute & IRoute>();
            /** 
             * 
             * 构建路由
             */
            static addRoute(routeClass: RouteClass): Map<string, BaseRoute & IRoute> {
                let service = routeClass.prototype[SERVICEPATH];
                if (this.route.get(service)) {
                    throw Error('重复添加路由器' + service);
                } else {
                    let routeObj = new routeClass();
                    this.route.set(service, routeObj)
                    console.log('添加路由', service);
                }
                // RouteBuilder.route[SERVICEPATH] = new routeClass();

                // this.route.get()

                return this.route;

            }

            static getRoute(): Middleware[] {
                var ctrl = { service: service, db: service.db };
                return [
                    //before
                    async (ctx, next) => {

                        let routeObj = this.route.get(ctx.params.service);
                        if (routeObj) {
                            console.log(`
                                service:${ctx.params.service}
                                action:${ctx.params.action}       
                                `)
                            // console.log(routeObj);
                            let temp = Object.assign({}, ctrl, { ctx, next });
                            await routeObj.before.bind(temp)(ctx, next);
                        } else {
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
                        } else {
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
                    }];

            }

            static scannerRoutes(dirPath: string): Router.IMiddleware[] {
                let state = fs.lstatSync(dirPath);
                if (state.isDirectory()) {
                    let files = fs.readdirSync(dirPath);
                    files.forEach(filename => {
                        let aboFile = path.resolve(dirPath, filename);
                        let relative = path.relative(__dirname, aboFile);
                        relative = relative.replace(/\\/g, '/');
                        let routePath = './' + relative;
                        console.log('路由文件:', routePath);
                        let routeClass: RouteClass = require(routePath).default;
                        this.addRoute(routeClass)
                    });
                    return this.getRoute();

                } else {
                    throw Error('please input a  directiory to be a scannerRoute Directory');
                }


            }


        }

        export class BaseRoute extends Object {



            public service = service;
            public db = service.db;

            ctx: Context;
            next: Function;

            doAction(action, method, next) {
                return next;
            }

            constructor() {
                super();
                delete this.service;
                delete this.db;

            }

        }
        export type RouteObject = BaseRoute & IRoute;
        export type RouteClass = new () => RouteObject;
    }

    export namespace Check {
        export function Query(key: string) {
            return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
                let method: Function = target[propertyKey];
                method.prototype[CHECKQUERY] = key;


            }
        }
        export function Body() {

        }
        export interface CheckResult {
            ok: boolean;
            errorMsg: string;
        }

    }

    export namespace Forms {

    }
}






