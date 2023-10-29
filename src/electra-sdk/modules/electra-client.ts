import { AuthData } from "../types/auth-data";
import { Json } from "../types/json.type";
import { getTimeStamp } from "../utils/get-ts";
import { Device } from "./device";

export class ElectraClient {
    static readonly baseUrl = 'https://app.ecpiot.co.il/mobile/mobilecommand'
    static readonly headers = new Headers({ "user-agent": "Electra Client" });

    private token: string;
    private imei: string;
    private sid?: string;
    private sidCreationTime?: number;

    constructor({ token, imei, sid, sidCreationTime }: AuthData) {
        this.token = token;
        this.imei = imei;
        this.sid = sid;
        this.sidCreationTime = sidCreationTime;
    }


    public static requestPayload(cmd: string, sid?: string, data?: Json): object {
        let payload: Json = {
            pvdid: 1,
            id: 99,
            cmd,
        };

        if (!!data) { payload['data'] = data; }
        if (!!sid) { payload['sid'] = sid; }

        return payload;
    };

    public static async request(body: object, debug = true): Promise<any> {
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

    public async getSid(): Promise<string> {
        const currentTS = getTimeStamp();
        if (this.sid && this.sidCreationTime && this.sidCreationTime > currentTS - 1000 * 60 * 60) {
            return this.sid;
        } else {
            const { imei, token } = this;
            const postData = {
                imei, token,
                os: "android",
                osver: "M4B30Z",
            };

            this.sid = (await ElectraClient.request(
                ElectraClient.requestPayload('VALIDATE_TOKEN', undefined, postData)
            )).data.sid;
            this.sidCreationTime = currentTS;
            return this.sid!;
        }
    }

    public async devices(): Promise<Device[]> {
        const devices: { [key: string]: any }[] = (await ElectraClient.request(
            ElectraClient.requestPayload('GET_DEVICES', (await this.getSid()), undefined)
        )).data.devices;
        return devices.map((device) => new Device(this, device.id))
    };
}