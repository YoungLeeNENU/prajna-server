import * as elasticsearch from "elasticsearch";
import * as request from 'request';
import { CoreOptions } from 'request';
import { prajnaRequestIndexHash } from '../utils/utils';

const remoteEsCluster = {
    ip: '45.32.254.14',
    port: 9200
}

class PrajnaProducer {
    public esType: string = 'PRAJNA';
    public index: string;
    private clientData: any;

    constructor(index?: string) {
        if (index) {
            this.index = index;
        }
    }

    _bulk(client: any, body: any[]): Promise<any> {
        return new Promise((resolve, reject) => {
            client.bulk({
                body: body
            }, (error: Error, response: any) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(response);
                }
            });
        });
    }

    async elasticsearchBulk(clientData: [any]) {
        if (!clientData || !clientData.length) {
            return;
        }
        try {
            let index = this.index || prajnaRequestIndexHash(clientData[0]["env"], clientData[0]["timestamp"], 'week');
            const directive = {
                "index": {
                    "_index": index,
                    "_type": this.esType,
                }
            };
            const directiveSeri = JSON.stringify(directive);
            console.log(typeof clientData);
            const data = clientData.join(`\n${directiveSeri}\n`);
            let bulkBody: any = [];

            clientData.forEach((element: any) => {
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

            let res = await this._bulk(client, bulkBody);
            return res;
        } catch (error) {
            console.log(error);
            return null;
        }
    }
}

export default PrajnaProducer;
