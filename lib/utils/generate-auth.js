"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const readline_1 = require("readline");
const electra_client_1 = require("../modules/electra-client");
async function input(question, rl) {
    const rlInterface = rl ?? (0, readline_1.createInterface)({
        input: process.stdin,
        output: process.stdout
    });
    return new Promise((resolve, _) => {
        rlInterface.question(question ?? "", (answer) => {
            resolve(answer);
        });
    });
}
async function initAuth() {
    const rl = (0, readline_1.createInterface)({
        input: process.stdin,
        output: process.stdout
    });
    const phone = await input("whats your phone number?: ", rl);
    const imei = await input("whats your imei code?: ", rl);
    const authData = { imei, phone };
    await electra_client_1.ElectraClient.request(electra_client_1.ElectraClient.requestPayload('SEND_OTP', undefined, authData));
    const code = await input("please enter the OTP code you got: ", rl);
    const { data } = await electra_client_1.ElectraClient.request(electra_client_1.ElectraClient.requestPayload("CHECK_OTP", undefined, {
        ...authData,
        code,
        os: "android",
        osver: "M4B30Z",
    }));
    console.log(`token: ${data.token}`);
}
;
initAuth();
//# sourceMappingURL=generate-auth.js.map