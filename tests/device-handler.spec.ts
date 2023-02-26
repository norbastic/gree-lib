import { getDeviceStatus, updateDevice } from "../device-handler";
import { DeviceParameterKeys, ModeParameter, PowerParameter, QuietParameter } from "../helpers/contants";
import { createDeviceSetRequest } from "../models/common-types";
import { scan, bindOne } from "../scanner";

describe("device handler tests", () => {
    test("get status", async () => {
        const deviceList = await scan("192.168.1.255");
        const acDevice = await bindOne(deviceList[0]);
        
        const status = await getDeviceStatus(acDevice);
        expect(status).not.toBe(undefined);
        expect(status?.Pow).toBe(0 | 1);
    });

    test("creates device set type", async () => {
        const parameters: Record<string, number> = {
            [DeviceParameterKeys.Power]: PowerParameter.on,
            [DeviceParameterKeys.Mode]: ModeParameter.heat,
            [DeviceParameterKeys.QuietMode]: QuietParameter.mode3      
        }
        expect(createDeviceSetRequest("s", parameters).opt[0]).toBe("Pow");
        expect(createDeviceSetRequest("s", parameters).opt[2]).toBe("Quiet");
        expect(createDeviceSetRequest("s", parameters).p[0]).toBe(1);  
        expect(createDeviceSetRequest("s", parameters).p[2]).toBe(3);        
    });

    test("it sets device parameter", async () => {
        const deviceList = await scan("192.168.1.255");
        const acDevice = await bindOne(deviceList[0]);

        const parameters: Record<string, number> = {
            [DeviceParameterKeys.SetTemperature]: 20  
        }

        const result = await updateDevice(acDevice, parameters);
        expect(result).toBe(true); 
    }, 10000);
});