import { getDeviceStatus } from "../src/device-handler";
import { scan, bindOne } from "../src/scanner";

describe("device handler tests", () => {
    test("get status", async () => {
        const deviceList = await scan("192.168.1.255");
        const acDevice = await bindOne(deviceList[0]);
        
        const status = await getDeviceStatus(acDevice);
        expect(status).not.toBe(undefined);

    }, 10000000);
});