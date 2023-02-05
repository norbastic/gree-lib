# gree-lib

All credits go to tomikaa87 who made an amazing work. Check out his work: [gree-remote](https://github.com/tomikaa87/gree-remote)

## Basic usage
```typescript
import { scan, bindOne } from "gree-lib/utils/scanner";

const devices = scan("192.168.1.255"); // Broadcast address

const bindResponse = bindOne(devices[0]);
```