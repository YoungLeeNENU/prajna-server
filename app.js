require('source-map-support/register')
module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 16);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

module.exports = require("koa-router");

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const Koa = __webpack_require__(11);
const koaBody = __webpack_require__(12);
const cors = __webpack_require__(10);
const Router = __webpack_require__(0);
const behavior_1 = __webpack_require__(2);
__webpack_require__(7).globalAgent.maxSockets = Infinity;
__webpack_require__(8).globalAgent.maxSockets = Infinity;
const path = __webpack_require__(15);
const convert = __webpack_require__(13);
const app = new Koa();
const router = new Router();
let port = 8080;
if (false) {
    port = 8081;
}
router.get('/', (ctx, next) => __awaiter(this, void 0, void 0, function* () {
    const BODY_HTML = [
        `prajna-server`,
    ].join('');
    ctx.body = BODY_HTML;
}));
router.use('/store', koaBody(), behavior_1.default());
try {
    app.use(cors());
    app.use(koaBody({
        jsonLimit: '5mb',
        formLimit: '4096kb',
        onerror: (err, ctx) => {
            ctx.throw(`body parse error：${err}`, 500);
        }
    }));
    app.use(router.routes());
    app.use(router.allowedMethods());
    app.listen(port);
}
catch (error) {
    // TODO: 
    console.error(error);
}


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const Router = __webpack_require__(0);
const response_type_1 = __webpack_require__(4);
const producer_1 = __webpack_require__(3);
const kafka = __webpack_require__(9); // import client
const ZK_PATH = '45.77.176.138:32770'; // zookeeper 地址
const TOPIC = 'prajna'; // Prajna 的 topic
const TEST_TOPIC = 'prajna-test'; // 测试的 topic
const Producer = kafka.Producer; // 获取 producer 类
const KeyedMessage = kafka.KeyedMessage; // 获取 KeyedMessage 类
const client = new kafka.Client(ZK_PATH); // 定义 client
const producer = new Producer(client); // 定义 producer
producer.on('ready', () => { console.log(`Kafka ${ZK_PATH} ready`); });
producer.on('error', (err) => { console.log('Producer Error:', err); });
function sendKafka(payloads) {
    return new Promise((resolve, reject) => {
        producer.send(payloads, (error, data) => {
            if (error) {
                reject(error);
            }
            else {
                resolve(data);
            }
        });
    });
}
function default_1() {
    const router = new Router();
    router.post('/ping/kafka', (ctx, next) => __awaiter(this, void 0, void 0, function* () {
        let responseJSON = {
            code: response_type_1.RESPONSE_MSG_CODE.FAIL,
            message: response_type_1.RESPONSE_MSG_DETAIL.FAIL_PRAJNA
        };
        try {
            const payloads = [
                { topic: TEST_TOPIC, messages: 'Hello, Prajna!', partition: 0 }
            ];
            const producerState = yield sendKafka(payloads);
            console.log(producerState);
            if (producerState[TEST_TOPIC]) {
                responseJSON = Object.assign(responseJSON, {
                    code: response_type_1.RESPONSE_MSG_CODE.SUCCESS,
                    message: response_type_1.RESPONSE_MSG_DETAIL.SUCCESS,
                    result: producerState
                });
            }
            ctx.body = responseJSON;
        }
        catch (error) {
            responseJSON = Object.assign(responseJSON, {
                message: error,
            });
            ctx.body = responseJSON;
        }
        yield next();
    }));
    router.post('/ping/es', (ctx, next) => __awaiter(this, void 0, void 0, function* () {
        let responseJSON = {
            code: response_type_1.RESPONSE_MSG_CODE.FAIL,
            message: response_type_1.RESPONSE_MSG_DETAIL.FAIL_PRAJNA
        };
        try {
            const mockData = [{
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
            let prajnaProducer = new producer_1.default();
            let res = yield prajnaProducer.elasticsearchBulk(mockData);
            if (res && !res.errors) {
                responseJSON.code = response_type_1.RESPONSE_MSG_CODE.SUCCESS;
                responseJSON.message = response_type_1.RESPONSE_MSG_DETAIL.SUCCESS;
            }
            responseJSON.result = res;
            ctx.body = responseJSON;
        }
        catch (error) {
            console.log(error);
            responseJSON = Object.assign(responseJSON, {
                message: error,
            });
            ctx.body = responseJSON;
        }
        yield next();
    }));
    router.post('/es', (ctx, next) => __awaiter(this, void 0, void 0, function* () {
        let responseJSON = {
            code: response_type_1.RESPONSE_MSG_CODE.FAIL,
            message: response_type_1.RESPONSE_MSG_DETAIL.FAIL_PRAJNA
        };
        try {
            const clientData = ctx.request.body;
            let prajnaProducer = new producer_1.default();
            let res = yield prajnaProducer.elasticsearchBulk(JSON.parse(clientData.data));
            if (res && !res.errors) {
                responseJSON.code = response_type_1.RESPONSE_MSG_CODE.SUCCESS;
                responseJSON.message = response_type_1.RESPONSE_MSG_DETAIL.SUCCESS;
            }
            responseJSON.result = res;
            ctx.body = responseJSON;
        }
        catch (error) {
            responseJSON = Object.assign(responseJSON, {
                message: error,
            });
            ctx.body = responseJSON;
        }
        yield next();
    }));
    return router.routes();
}
exports.default = default_1;


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const elasticsearch = __webpack_require__(6);
const utils_1 = __webpack_require__(5);
const remoteEsCluster = {
    ip: '45.32.254.14',
    port: 9200
};
class PrajnaProducer {
    constructor(index) {
        this.esType = 'PRAJNA';
        if (index) {
            this.index = index;
        }
    }
    _bulk(client, body) {
        return new Promise((resolve, reject) => {
            client.bulk({
                body: body
            }, (error, response) => {
                if (error) {
                    reject(error);
                }
                else {
                    resolve(response);
                }
            });
        });
    }
    elasticsearchBulk(clientData) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!clientData || !clientData.length) {
                return;
            }
            try {
                let index = this.index || utils_1.prajnaRequestIndexHash(clientData[0]["env"], clientData[0]["timestamp"], 'week');
                const directive = {
                    "index": {
                        "_index": index,
                        "_type": this.esType,
                    }
                };
                const directiveSeri = JSON.stringify(directive);
                console.log(typeof clientData);
                const data = clientData.join(`\n${directiveSeri}\n`);
                let bulkBody = [];
                clientData.forEach((element) => {
                    var msg = element;
                    msg['@timestamp'] = msg.timestamp;
                    delete msg.timestamp;
                    bulkBody.push({ index: { _index: index, _type: this.esType } });
                    bulkBody.push(msg);
                });
                const client = new elasticsearch.Client({
                    host: `${remoteEsCluster.ip}:${remoteEsCluster.port}`,
                    log: 'trace'
                });
                let res = yield this._bulk(client, bulkBody);
                return res;
            }
            catch (error) {
                console.log(error);
                return null;
            }
        });
    }
}
exports.default = PrajnaProducer;


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var RESPONSE_MSG_CODE;
(function (RESPONSE_MSG_CODE) {
    RESPONSE_MSG_CODE[RESPONSE_MSG_CODE["SUCCESS"] = 200] = "SUCCESS";
    RESPONSE_MSG_CODE[RESPONSE_MSG_CODE["FAIL"] = 500] = "FAIL";
})(RESPONSE_MSG_CODE || (RESPONSE_MSG_CODE = {}));
exports.RESPONSE_MSG_CODE = RESPONSE_MSG_CODE;
;
var RESPONSE_MSG_DETAIL;
(function (RESPONSE_MSG_DETAIL) {
    RESPONSE_MSG_DETAIL["SUCCESS"] = "Success";
    RESPONSE_MSG_DETAIL["FAIL_PRAJNA"] = "Failure when storing Prajna";
})(RESPONSE_MSG_DETAIL || (RESPONSE_MSG_DETAIL = {}));
exports.RESPONSE_MSG_DETAIL = RESPONSE_MSG_DETAIL;
;


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Moment = __webpack_require__(14);
function prajnaRequestIndexHash(env, ISOTime, seed) {
    let bucket;
    switch (seed.toLowerCase()) {
        case 'day':
            bucket = (Moment(ISOTime).dayOfYear()) + '';
            break;
        case 'week':
            bucket = (Moment(ISOTime).week()) + '';
            break;
        case 'isoweek':
            bucket = (Moment(ISOTime).isoWeek()) + '';
            break;
        case 'month':
            bucket = (Moment(ISOTime).month() + 1) + '';
            break;
        case 'quarter':
            bucket = (Moment(ISOTime).quarter()) + '';
            break;
        default:
            if (isNaN(+seed)) {
                bucket = 'unique';
            }
            else {
                let dayofYear = Moment(ISOTime).dayOfYear(); // time unit
                if (dayofYear % +seed == 0) {
                    bucket = (dayofYear / +seed) + '';
                }
                else {
                    bucket = (Math.floor(dayofYear / +seed) + 1) + '';
                }
            }
            break;
    }
    ;
    const hash = `prajna-${env}-${bucket}-${seed}`;
    return hash;
}
exports.prajnaRequestIndexHash = prajnaRequestIndexHash;


/***/ },
/* 6 */
/***/ function(module, exports) {

module.exports = require("elasticsearch");

/***/ },
/* 7 */
/***/ function(module, exports) {

module.exports = require("http");

/***/ },
/* 8 */
/***/ function(module, exports) {

module.exports = require("https");

/***/ },
/* 9 */
/***/ function(module, exports) {

module.exports = require("kafka-node");

/***/ },
/* 10 */
/***/ function(module, exports) {

module.exports = require("kcors");

/***/ },
/* 11 */
/***/ function(module, exports) {

module.exports = require("koa");

/***/ },
/* 12 */
/***/ function(module, exports) {

module.exports = require("koa-bodyparser");

/***/ },
/* 13 */
/***/ function(module, exports) {

module.exports = require("koa-convert");

/***/ },
/* 14 */
/***/ function(module, exports) {

module.exports = require("moment");

/***/ },
/* 15 */
/***/ function(module, exports) {

module.exports = require("path");

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(1);


/***/ }
/******/ ]);
//# sourceMappingURL=app.map