import * as Koa from 'koa';
import * as koaBody from 'koa-bodyparser';
import * as cors from 'kcors';
import * as Router from 'koa-router';

import behaviorRouter from './behavior/behavior';

require('http').globalAgent.maxSockets = Infinity;
require('https').globalAgent.maxSockets = Infinity;

const path = require('path');
const convert = require('koa-convert');

declare const __DEV__: boolean;

const app: Koa = new Koa();
const router: Router = new Router();
let port: number = 8080;
if (__DEV__) { port = 8081; }

router.get('/', async (ctx: Router.IRouterContext, next: () => Promise<Koa.Middleware>) => {
    const BODY_HTML: string = [
        `prajna-server`,
    ].join('');

    ctx.body = BODY_HTML;
});

router.use('/store', koaBody(), behaviorRouter());
router.get('/ping', async (ctx: Router.IRouterContext, next: () => Promise<Koa.Middleware>) => {
    const BODY_HTML: string = [
        `<!DOCTYPE html>`,
        `<html>`,
        `<head><meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=0">`,
        `<title>Prajna Ping Test</title></head>`,
        `<body style="margin:0; padding: 0; zoom: 1">`,
        `<div style="text-align: center; margin-top: 42px;">`,
        `<div style="text-align: center; margin-top: 24px;">`,
        `<h1 style="font-weight: 200;">ping</h1>`,
        `<div style="margin-top: 66px">`,
        `</div>`,
        `</div>`,
        `</body>`,
        `</html>`
    ].join('');

    ctx.body = BODY_HTML;

    await next();
});

try {
    app.use(cors());
    app.use(koaBody({
        jsonLimit: '5mb',
        formLimit: '4096kb',
        onerror: (err: Error, ctx: Router.IRouterContext) => {
            ctx.throw(`body parse error：${err}`, 500);
        }
    }));

    app.use(router.routes());
    app.use(router.allowedMethods());

    console.log(`prajna server is running on ${port}`);
    app.listen(port);
} catch (error) {
    // TODO: 
    console.error(error);
}


