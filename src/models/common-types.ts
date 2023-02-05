export type DeviceResponse = {
    readonly json: string;
    readonly address: string;
}

export type BasePackInfo = {
    readonly t: string;
    readonly cid: string;
}

export type PackInfo = BasePackInfo & {
    readonly i: number;
    readonly pack: string;
    readonly tcid: string;
    readonly uid: number;
}

export type DeviceInfo = {
    readonly t: string;
    readonly cid: string;
    readonly bc: string;
    readonly brand: string;
    readonly catalog: string;
    readonly mac: string;
    readonly mid: string;
    readonly model: string;
    readonly name: string;
    readonly series: string;
    readonly vender: string;
    readonly ver: string;
    readonly lock: number;
    readonly address: string;
}

export type Request = BasePackInfo & {
    readonly i: number;
    readonly tcid: string;
    readonly uid: number;
    readonly pack: string;
}

export type BindRequestPack = {
    readonly t: string;
    readonly mac: string;
    readonly uid: number;
}

export type BindResponse = {
    readonly t: string;
    readonly mac: string;
    readonly key: string;
    readonly r: number;
}

export const createBindRequestPack = (mac: string): BindRequestPack => {
    return {
        t: "bind",
        mac,
        uid: 0
    };
}

export const createRequest = (targetClientId: string, pack: string, i: number = 0): Request => {
    return {
        cid: "app",
        t: "pack",
        i: i,
        tcid: targetClientId,
        pack,
        uid: 0
    };
}