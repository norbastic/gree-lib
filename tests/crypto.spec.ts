import { decryptGenericData, encryptGenericData } from "../src/crypto/crypto";
import { DeviceInfo } from "../src/models/common-types";

describe("encryp and decrypt", () => {
    const dataInJson = "{\"t\":\"dev\",\"cid\":\"f4911ed36c8d\",\"bc\":\"000000000000000000000000000000\",\"brand\":\"gree\",\"catalog\":\"gree\",\"mac\":\"f4911ed36c8d\",\"mid\":\"10007\",\"model\":\"gree\",\"name\":\"1ed36c8d\",\"series\":\"gree\",\"vender\":\"1\",\"ver\":\"V1.2.1\",\"lock\":0}"
    const data1 = "LP24Ek0OaYogxs3iQLjL4EnJebFD9WzsYxvUM7gywz+Ma9lM2RqI/KytvJ32IsGSZXrOr+MakVzzXHbghPeyijnWMzaLQaaw1aFXlE9k71L0cMm8bsr/y4FkxumpRg1tKs/34xhBuMSxXfNfvEgS501CrkI0PqwFRGup93O76/WDh4MTKYwT1BwNjN2ir+0enKYbt0iIDsdp8/ftXlA9Ht3KZYKObqJFWeacWXPPs+m80gq9HxK8Loa8WXVjgZcP4Vf5MjKxa60Xt5J1oI+lsxUuXTHkgunLg76WWGy+euo=";    

    test("decrypt generic data", () => {        
        const json = decryptGenericData(data1);
        let obj: DeviceInfo | undefined = undefined;
        
        if (json) {
            obj = JSON.parse(json);
        }

        expect(obj?.brand).toBe("gree");

    });

    test("encrypt and decrypt data", () => {
        const encrypted = encryptGenericData(dataInJson);
        
        expect(encrypted).toBe(data1);
    });
});