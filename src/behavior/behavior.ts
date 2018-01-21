import * as Koa from 'koa';
import * as Router from 'koa-router';
import * as elasticsearch from "elasticsearch";
import {
    RESPONSE_MSG_CODE,
    RESPONSE_MSG_DETAIL,
    Response
} from '../type/response.type';
import PrajnaProducer from '../producer/producer';

const kafka = require('kafka-node');	  // import client
const ZK_PATH = '45.77.176.138:32770';	  // zookeeper 地址
const TOPIC = 'prajna';					  // Prajna 的 topic
const TEST_TOPIC = 'prajna-test';		  // 测试的 topic
const Producer = kafka.Producer;		  // 获取 producer 类
const KeyedMessage = kafka.KeyedMessage;  // 获取 KeyedMessage 类
const client = new kafka.Client(ZK_PATH); // 定义 client
const producer = new Producer(client);	  // 定义 producer

producer.on('ready', () => { console.log(`Kafka ${ZK_PATH} ready`); });

producer.on('error', (err: Error) => { console.log('Producer Error:', err); });

function sendKafka(payloads: any) {
    return new Promise((resolve, reject) => {
        producer.send(payloads, (error: Error, data: any) => {
            if (error) {
                reject(error);
            } else {
                resolve(data);
            }
        });
    });
}

export default function () {
    const router: Router = new Router();

    router.post('/ping/kafka', async (ctx: Router.IRouterContext, next: () => Promise<Koa.Middleware>) => {
        let responseJSON: Response = {
            code: RESPONSE_MSG_CODE.FAIL,
            message: RESPONSE_MSG_DETAIL.FAIL_PRAJNA
        };
        try {
            const payloads = [
                { topic: TEST_TOPIC, messages: 'Hello, Prajna!', partition: 0 }
            ];
            const producerState: any = await sendKafka(payloads);
            console.log(producerState);
            if (producerState[TEST_TOPIC]) {
                responseJSON = Object.assign(responseJSON, {
                    code: RESPONSE_MSG_CODE.SUCCESS,
                    message: RESPONSE_MSG_DETAIL.SUCCESS,
                    result: producerState
                });
            }
            ctx.body = responseJSON;
        } catch (error) {
            responseJSON = Object.assign(responseJSON, {
                message: error,
            });
            ctx.body = responseJSON;
        }

        await next();
    });

    router.post('/ping/es', async (ctx: Router.IRouterContext, next: () => Promise<Koa.Middleware>) => {
        let responseJSON: Response = {
            code: RESPONSE_MSG_CODE.FAIL,
            message: RESPONSE_MSG_DETAIL.FAIL_PRAJNA
        };
        try {
            const mockData: [any] = [{
                env: 'beta',
                project: 'prajna-test',
                pageId: 'prajna-test-page',
                timestamp: new Date().toISOString(),
                pv: {
                    pageUrl: 'https://prajna.test.com/test'
                }
            }, {
                env: 'beta',
                project: 'prajna-test',
                pageId: 'prajna-test-page',
                timestamp: new Date().toISOString(),
                log: {
                    content: 'Hello, Prajna!'
                }
            }];
            let prajnaProducer = new PrajnaProducer();
            let res = await prajnaProducer.elasticsearchBulk(mockData);
            if (res && !res.errors) {
                responseJSON.code = RESPONSE_MSG_CODE.SUCCESS;
                responseJSON.message = RESPONSE_MSG_DETAIL.SUCCESS;
            }
            responseJSON.result = res;
            ctx.body = responseJSON;
        } catch (error) {
            console.log(error);
            responseJSON = Object.assign(responseJSON, {
                message: error,
            });
            ctx.body = responseJSON;
        }

        await next();
    });

    router.post('/es', async (ctx: Router.IRouterContext, next: () => Promise<Koa.Middleware>) => {
        let responseJSON: Response = {
            code: RESPONSE_MSG_CODE.FAIL,
            message: RESPONSE_MSG_DETAIL.FAIL_PRAJNA
        };
        try {
            const clientData = ctx.request.body;
            let prajnaProducer = new PrajnaProducer();
            let res = await prajnaProducer.elasticsearchBulk(JSON.parse(clientData.data));
            if (res && !res.errors) {
                responseJSON.code = RESPONSE_MSG_CODE.SUCCESS;
                responseJSON.message = RESPONSE_MSG_DETAIL.SUCCESS;
            }
            responseJSON.result = res;
            ctx.body = responseJSON;
        } catch (error) {
            responseJSON = Object.assign(responseJSON, {
                message: error,
            });
            ctx.body = responseJSON;
        }

        await next();
    });

    return router.routes();
}
