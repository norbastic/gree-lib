import udp from 'node:dgram';
import { Buffer } from 'node:buffer';
import { PackInfo, DeviceResponse, DeviceInfo, createBindRequestPack, createRequest, BindResponse, ACDevice } from './models/common-types';
import { decryptGenericData, encryptGenericData } from './crypto/crypto';

export const scan = async (broadcastAddress: string, scanTime: number = 2000): Promise<DeviceInfo[]> => {
    const responses = await discoverLocalDevices(broadcastAddress, scanTime);

    const deviceInfoArray: DeviceInfo[] = [];

    for (const response of responses) {
        const packInfo: PackInfo = JSON.parse(response.json);

        if (packInfo.t !== "pack") {
            continue;
        }

        const decryptedPack: string | undefined = decryptGenericData(packInfo.pack);
        if(decryptedPack) {
            const deviceInfo = JSON.parse(decryptedPack);
            if(deviceInfo.t !== "dev") {
                continue;            
            } else {
                deviceInfoArray.push({...deviceInfo, address: response.address});
            }
        }
    }

    return deviceInfoArray;
}

const discoverLocalDevices = async (broadcastAddress: string, scanTime: number = 2000): Promise<DeviceResponse[]> => {
    return new Promise((resolve, reject) => {
        const responses: DeviceResponse[] = [];
        const socket = udp.createSocket("udp4");
        const broadcastMsg = "{ \"t\": \"scan\" }";
        const bytes = Buffer.from(broadcastMsg, "ascii");

        socket.bind();               
        socket.on("listening", () => {
            socket.setBroadcast(true);

            socket.send(bytes, 0, bytes.length, 7000, broadcastAddress, (err) => {
                if (err) {
                    socket.close();
                    reject(err);
                }
              });

            socket.on("message", (msg, rinfo) => {
                responses.push({ json: msg.toString(), address: rinfo.address });          
            });

            socket.on("close", () => {
                resolve(responses);                
            });

            // Let's wait 2 sec or more to receive all AC responses
            setTimeout(() => {
                socket.close();
            }, scanTime);
        });        
    });

}

export const bindOne = async (deviceInfo: DeviceInfo): Promise<ACDevice> => {
    const socket = udp.createSocket("udp4");
    return new Promise((resolve, reject) => {
        try {
            const bindRequestPack = createBindRequestPack(deviceInfo.mac);
            const pack = encryptGenericData(JSON.stringify(bindRequestPack));
            const request = createRequest(deviceInfo.mac, pack, 1);
            const requestJson = JSON.stringify(request);
            const requestBytes = Buffer.from(requestJson, "ascii");

            socket.send(requestBytes, 0, requestBytes.length, 7000, deviceInfo.address);

            socket.on("error", (err) => {
                socket.close();
                reject(undefined);
            });

            socket.on("message", (msg, rinfo) => {
                if(deviceInfo.address !== rinfo.address) {
                    socket.close();
                    reject(undefined);
                }

                const message = msg.toString();
                const bindResponse: PackInfo = JSON.parse(message);
                if(bindResponse.t !== "pack") {
                    socket.close();
                    reject(undefined);
                }

                const decryptedPack = decryptGenericData(bindResponse.pack);
                if(decryptedPack) {
                    const decryptedObj: BindResponse = JSON.parse(decryptedPack);
                    socket.close();
                    resolve({
                        clientId: deviceInfo.cid,
                        mac: deviceInfo.mac,
                        name: deviceInfo.name,
                        deviceKey: decryptedObj.key,
                        model: deviceInfo.model,
                        address: deviceInfo.address
                    });
                }                                                               
            }); 
   
        } catch(err) {
            //TODO: logging properly
            socket.close();
            reject(undefined);
        }
    });
}

/**
  * Binds the source computer to the target device
  *
  * @function bindWithMAC
  * @param {string} mac - MAC address of the device.
  * @param {string} ipAddress - IP address of the device.
  * @returns {string} The encryption key if bind was successful.
  */
export const bindWithMAC = async (mac: string, ipAddress: string): Promise<string | undefined> => {
    const socket = udp.createSocket("udp4");
    return new Promise((resolve, reject) => {
        try {
            const bindRequestPack = createBindRequestPack(mac);
            const pack = encryptGenericData(JSON.stringify(bindRequestPack));
            const request = createRequest(mac, pack, 1);
            const requestJson = JSON.stringify(request);
            const requestBytes = Buffer.from(requestJson, "ascii");

            socket.send(requestBytes, 0, requestBytes.length, 7000, ipAddress);

            socket.on("error", (err) => {
                socket.close();
                reject(undefined);
            });

            socket.on("message", (msg, rinfo) => {
                if(ipAddress !== rinfo.address) {
                    socket.close();
                    reject(undefined);
                }

                const message = msg.toString();
                const bindResponse: PackInfo = JSON.parse(message);
                if(bindResponse.t !== "pack") {
                    socket.close();
                    reject(undefined);
                }

                const decryptedPack = decryptGenericData(bindResponse.pack);
                if(decryptedPack) {
                    const decryptedObj: BindResponse = JSON.parse(decryptedPack);
                    socket.close();
                    resolve(decryptedObj.key);
                }                                                               
            }); 
   
        } catch(err) {
            socket.close();
            reject(undefined);
        }
    });
}

export const bindMultiple = async (deviceInfo: DeviceInfo[]): Promise<ACDevice[]> => {
    const bindAllResult: ACDevice[] = [];

    for (const devInfo of deviceInfo) {
        const bindResult = await bindOne(devInfo);
        bindAllResult.push(bindResult);   
    }

    return bindAllResult;
}