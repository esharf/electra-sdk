"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ElectraClient = void 0;
const get_ts_1 = require("../utils/get-ts");
const device_1 = require("./device");
class ElectraClient {
    static baseUrl = 'https://app.ecpiot.co.il/mobile/mobilecommand';
    static headers = new Headers({ "user-agent": "Electra Client" });
    token;
    imei;
    sid;
    sidCreationTime;
    constructor({ token, imei, sid, sidCreationTime }) {
        this.token = token;
        this.imei = imei;
        this.sid = sid;
        this.sidCreationTime = sidCreationTime;
    }
    static requestPayload(cmd, sid, data) {
        let payload = {
            pvdid: 1,
            id: 99,
            cmd,
        };
        if (!!data) {
            payload['data'] = data;
        }
        if (!!sid) {
            payload['sid'] = sid;
        }
        return payload;
    }
    ;
    static async request(body, debug = true) {
        if (debug) {
            console.log("sending request");
            console.log(JSON.stringify(body, null, 4));
        }
        const res = await fetch(ElectraClient.baseUrl, {
            method: 'POST',
            headers: ElectraClient.headers,
            body: JSON.stringify(body)
        });
        if (!res.ok) {
            throw new Error(`request failed: ${res.status} response: ${await res.text()}`);
        }
        if (debug) {
            console.log("got response");
            const x = await res.json();
            console.log(JSON.stringify(x, null, 4));
            return x;
        }
        return await res.json();
    }
    async getSid() {
        const currentTS = (0, get_ts_1.getTimeStamp)();
        if (this.sid && this.sidCreationTime && this.sidCreationTime > currentTS - 1000 * 60 * 60) {
            return this.sid;
        }
        else {
            const { imei, token } = this;
            const postData = {
                imei, token,
                os: "android",
                osver: "M4B30Z",
            };
            this.sid = (await ElectraClient.request(ElectraClient.requestPayload('VALIDATE_TOKEN', undefined, postData))).data.sid;
            this.sidCreationTime = currentTS;
            return this.sid;
        }
    }
    async devices() {
        const devices = (await ElectraClient.request(ElectraClient.requestPayload('GET_DEVICES', (await this.getSid()), undefined))).data.devices;
        return devices.map((device) => new device_1.Device(this, device.id));
    }
    ;
}
exports.ElectraClient = ElectraClient;
//# sourceMappingURL=electra-client.js.map