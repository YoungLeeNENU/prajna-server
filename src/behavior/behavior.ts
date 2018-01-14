import * as Koa from 'koa';
import * as Router from 'koa-router';

const ZK_PATH = '45.77.176.138:32770'; // zookeeper 地址
const TOPIC = 'prajna';				  // 设置 Topic
const kafka = require('kafka-node');  // import client
const Producer = kafka.Producer;	  // 获取 producer 类
const KeyedMessage = kafka.KeyedMessage; // 获取 KeyedMessage 类
const client = new kafka.Client(ZK_PATH); // 定义 client
const producer = new Producer(client);	  // 定义 producer

producer.on('ready', () => {
    console.log(`Kafka ${ZK_PATH} ready`);
});

producer.on('error', (err: Error) => {
    console.log('Producer Error:', err);
});

export default function () {
    const router: Router = new Router();

    router.get('/ping/kafka', async (ctx: Router.IRouterContext, next: () => Promise<Koa.Middleware>) => {
        ctx.body = {
            code: 200,
        };
        await next();
    });

    return router.routes();
}
