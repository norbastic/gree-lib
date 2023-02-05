import { scan, bindMultiple, bindOne } from "../src/utils/scanner";
import udp from "dgram";

describe("scanner tests", () => {
    test("scanner returns devices", async () => {
        
        const deviceList = await scan("192.168.1.255");

        expect(deviceList.length > 0).toBe(true);
    }, 10000000);

    test("it binds one device", async () => {
        const deviceList = await scan("192.168.1.255");
        const bindResult = await bindOne(deviceList[0]);       

        expect(bindResult.t).toBe("bindok");
    }, 10000000);


    test("it binds the devices", async () => {
        const deviceList = await scan("192.168.1.255");
        const bindResult = await bindMultiple(deviceList);        

        expect(bindResult[0].t).toBe("bindok");
    }, 10000000);
});