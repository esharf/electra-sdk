import { createInterface, Interface } from 'readline';
import { ElectraClient } from '../modules/electra-client';


async function input(question?: string, rl?: Interface): Promise<string> {
    const rlInterface = rl ?? createInterface({
        input: process.stdin,
        output: process.stdout
    });
    return new Promise((resolve, _) => {
        rlInterface.question(question ?? "", (answer) => {
            resolve(answer)
        })
    });
}

async function initAuth(): Promise<void> {
    const rl = createInterface({
        input: process.stdin,
        output: process.stdout
    });

    const phone = await input("whats your phone number?: ", rl);
    const imei = await input("whats your imei code?: ", rl);

    const authData = { imei, phone };
    await ElectraClient.request(ElectraClient.requestPayload('SEND_OTP', undefined, authData));

    const code = await input("please enter the OTP code you got: ", rl);

    const { data } = await ElectraClient.request(ElectraClient.requestPayload("CHECK_OTP",
        undefined, {
        ...authData,
        code,
        os: "android",
        osver: "M4B30Z",
    }
    ));

    console.log(`token: ${data.token}`);
};


initAuth();