import { DeviceStatus } from "./device-status";
import { ElectraClient } from "./electra-client";

export class Device {
    id: number;
    _client: ElectraClient;

    constructor(client: ElectraClient, id: number) {
        this._client = client;
        this.id = id;
    }


    public async status(): Promise<object> {
        const { data } = await ElectraClient.request(ElectraClient.requestPayload('GET_LAST_TELEMETRY', await this._client.getSid(), { "id": this.id, "commandName": "OPER,DIAG_L2" }));
        console.log(JSON.stringify(data, null, 4));
        const { commandJson } = data;
        Object.keys(commandJson).forEach((key) => { commandJson[key] = JSON.parse(commandJson[key]) });
        return DeviceStatus.fromJson(data["OPER"]["OPER"] ?? {});
    }

    public async setStatus(status: DeviceStatus): Promise<void> {
        await ElectraClient.request(ElectraClient.requestPayload(
            'SEND_COMMAND',
            await this._client.getSid(),
            { id: this.id, "commandJson": JSON.stringify({ OPER: status.toJson() }) }
        ));
    }
}
