import { decryptGenericData, encryptGenericData } from "./crypto/crypto";
import { DeviceParameterKeys } from "./helpers/contants";
import { 
    ACDevice,
    createRequest,
    Request,
    createStatusRequestPack,
    PackInfo,
    StatusData,
    createDeviceSetRequest,
    DeviceSetResponse } from "./models/common-types";
import udp from "node:dgram";

const sendRequest = async (request: Request, address: string): Promise<PackInfo> => {
    const requestJson = JSON.stringify(request);
    const requestBytes = Buffer.from(requestJson, "ascii");

    return new Promise((resolve, reject) => {
        try {
            const socket = udp.createSocket("udp4");
            socket.send(requestBytes, 0, requestBytes.length, 7000, address);
    
            socket.on("error", (err) => {
                reject(undefined);
            });

            socket.on("message", (msg) => {
                const responseJson = msg.toString("ascii");
                resolve(JSON.parse(responseJson) as PackInfo);
            });
        } catch {
            reject(undefined);
        }
    });
}

export const getDeviceStatus = async (device: ACDevice): Promise<Record<string, number> | undefined> => {
    const cols = Object.values(DeviceParameterKeys);
    const statusRequestPack = createStatusRequestPack(device.mac, cols);
    const statusPackJson = JSON.stringify(statusRequestPack);
    const encrypted = encryptGenericData(statusPackJson, device.deviceKey);

    const request = createRequest(device.mac, encrypted);
    const response = await sendRequest(request, device.address);

    if(response.t !== "pack") {
        return undefined;
    }

    const decryptedPack = decryptGenericData(response.pack, device.deviceKey);
    if (decryptedPack) {
        const obj = JSON.parse(decryptedPack) as StatusData;
        
        if(obj.t !== "dat") {
            return undefined;
        }
        
        return obj.cols.reduce((acc, cur, i) => 
            ({...acc, [cur]: obj.dat[i]}), {});
    }
    
}

export const updateDevice = async (acDevice: ACDevice, parameters: Record<string, number>): Promise<boolean> => {
    const pack = createDeviceSetRequest(acDevice.clientId, parameters);
    const packJson = JSON.stringify(pack);
    const encryptedPack = encryptGenericData(packJson, acDevice.deviceKey);
    const request = createRequest(acDevice.clientId, encryptedPack);
    
    try {
        const result = await sendRequest(request, acDevice.address);
        const decryptedJson = decryptGenericData(result.pack, acDevice.deviceKey);
        if (decryptedJson) {
            const responsePack: DeviceSetResponse = JSON.parse(decryptedJson);
            console.log(responsePack);
            return true;
        }
        
        return false;
        
    } catch(err) {
        return false;
    }
}