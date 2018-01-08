import * as Koa from 'koa';
import * as koaBody from 'koa-bodyparser';
import * as cors from 'kcors';
import * as Router from 'koa-router';

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

    app.listen(port);
} catch (error) {
    // TODO: 
    console.error(error);
}
