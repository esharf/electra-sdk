"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Device = void 0;
const device_status_1 = require("./device-status");
const electra_client_1 = require("./electra-client");
class Device {
    id;
    _client;
    constructor(client, id) {
        this._client = client;
        this.id = id;
    }
    async status() {
        const { data } = await electra_client_1.ElectraClient.request(electra_client_1.ElectraClient.requestPayload('GET_LAST_TELEMETRY', await this._client.getSid(), { "id": this.id, "commandName": "OPER,DIAG_L2" }));
        console.log(JSON.stringify(data, null, 4));
        const { commandJson } = data;
        Object.keys(commandJson).forEach((key) => { commandJson[key] = JSON.parse(commandJson[key]); });
        return device_status_1.DeviceStatus.fromJson(data["OPER"]["OPER"] ?? {});
    }
    async setStatus(status) {
        await electra_client_1.ElectraClient.request(electra_client_1.ElectraClient.requestPayload('SEND_COMMAND', await this._client.getSid(), { id: this.id, "commandJson": JSON.stringify({ OPER: status.toJson() }) }));
    }
}
exports.Device = Device;
//# sourceMappingURL=device.js.map