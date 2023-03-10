# gree-lib

All credits go to tomikaa87 who made an amazing work. Check out his work: [gree-remote](https://github.com/tomikaa87/gree-remote)
It's a very simple library for handling GREE air conditioners from Node.js.

## Basic usage
```typescript
import { scan, bindOne } from "gree-lib";
import { getDeviceStatus, updateDevice } from "gree-lib";
import { DeviceParameterKeys, ModeParameter, PowerParameter, QuietParameter } from "gree-lib";
...
const devices = await scan("192.168.1.255"); // Broadcast address

const acDevice = await bindOne(devices[0]);
const parameters: Record<string, number> = {
    [DeviceParameterKeys.Power]: PowerParameter.on,
    [DeviceParameterKeys.Mode]: ModeParameter.heat,
    [DeviceParameterKeys.QuietMode]: QuietParameter.mode3      
}

// Returns true if it was successful, otherwise false.
const updateResult = updateDevice(acDevice, parameters);
```