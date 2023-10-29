import { ACMode } from "../enums/ac-mode";
import { FanSpeed } from "../enums/fan-speed";
import { ClearFilter } from "../enums/clear-filter";
import { Json } from "../types/json.type";

export class DeviceStatus {

    temperature!: number;
    currentTemperature!: number;
    mode!: ACMode;
    fan!: FanSpeed;
    clearFilter!: boolean;

    public toJson(): Json {
        const data: Json = {
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

    static fromJson(data: Json): DeviceStatus {
        const deviceStatus = new DeviceStatus();
        deviceStatus.temperature = parseInt(data["SPT"] as string);
        deviceStatus.mode = data["AC_MODE"] as ACMode;
        deviceStatus.fan = data["FANSPD"] as FanSpeed;
        deviceStatus.clearFilter = ClearFilter.ON == data["CLEAR_FILT"];
        return deviceStatus;
    }
}
