import { decryptGenericData, encryptGenericData } from "./crypto/crypto";
import { DeviceParameterKeys } from "./helpers/contants";
import { ACDevice, createRequest, Request, createStatusRequestPack, PackInfo, StatusData } from "./models/common-types";
import udp from "dgram";

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
        
        return obj.cols.reduce(
            (acc, cur, i) => ({...acc, [cur]: obj.dat[i]}), {}
        );
    }
    
}

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