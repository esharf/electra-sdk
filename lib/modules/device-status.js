"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeviceStatus = void 0;
const clear_filter_1 = require("../enums/clear-filter");
class DeviceStatus {
    temperature;
    currentTemperature;
    mode;
    fan;
    clearFilter;
    toJson() {
        const data = {
            AC_STSRC: "WI-FI"
        };
        if (!!this.temperature) {
            data["SPT"] = this.temperature.toString();
        }
        if (!!this.mode) {
            data["AC_MODE"] = this.mode;
        }
        if (!!this.fan) {
            data["FANSPD"] = this.fan;
        }
        return data;
    }
    static fromJson(data) {
        const deviceStatus = new DeviceStatus();
        deviceStatus.temperature = parseInt(data["SPT"]);
        deviceStatus.mode = data["AC_MODE"];
        deviceStatus.fan = data["FANSPD"];
        deviceStatus.clearFilter = clear_filter_1.ClearFilter.ON == data["CLEAR_FILT"];
        return deviceStatus;
    }
}
exports.DeviceStatus = DeviceStatus;
//# sourceMappingURL=device-status.js.map