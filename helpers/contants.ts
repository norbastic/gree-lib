export const GENERIC_KEY = "a3K8Bx%2r8Y7#xDh";
export const CBC_KEY = new Uint8Array([17, 155, 240, 206, 16, 88, 114, 75, 31, 172, 171, 51, 239, 16, 69]);
export const CBC_IV = new Uint8Array([86, 33, 23, 153, 109, 9, 61, 40, 221, 179, 186, 105, 90, 46, 111, 88]);

export enum DeviceParameterKeys {
    Power = "Pow",
    Mode = "Mod",
    SetTemperature = "SetTem",
    FanSpeed = "WdSpd",
    AirMode = "Air",
    XfanMode = "Blo",
    HealthMode = "Health",
    SleepMode = "SwhSlp",
    Light = "Lig",
    VerticalSwing = "SwUpDn",
    QuietMode = "Quiet",
    TurboMode = "Tur",
    EnergySavingMode = "SvSt",
    TemperatureUnit = "TemUn"
}

export enum PowerParameter {
    off = 0,
    on = 1
}

export enum ModeParameter {
    auto = 0,
    cool = 1,
    dry = 2,
    fan = 3,
    heat = 4
}

export enum TempUnitParameter {
    celsius = 0,
    fahrenheit = 1
}

export enum FanSpeedParameter {
    auto = 0,
    low = 1,
    mediumLow = 2,
    medium = 3,
    mediumHigh = 4,
    high = 5
}

export enum AirParameter {
    off = 0,
    inside = 1,
    outside = 2,
    mode3 = 3
}

export enum HealthParameter {
    off = 0,
    on = 1,
}

export enum SleepParameter {
    off = 0,
    on = 1,
}

export enum LightsParameter {
    off = 0,
    on = 1,
}

export enum SwingHorizontalParameter {
    default = 0,
    full = 1,
    fixedLeft = 2,
    fixedMidLeft = 3,
    fixedMid = 4,
    fixedMidRight = 5,
    fixedRight = 6,
    fullAlt = 7,
}

export enum SwingVerticalParameter {
    default = 0,
    full = 1,
    fixedTop = 2,
    fixedMidTop = 3,
    fixedMid = 4,
    fixedMidBottom = 5,
    fixedBottom = 6,
    swingBottom = 7,
    swingMidBottom = 8,
    swingMid = 9,
    swingMidTop = 10,
    swingTop = 11,
}

export enum QuietParameter {
    off = 0,
    mode1 = 1,
    mode2 = 2,
    mode3 = 3,
}

export enum TurboParameter {
    off = 0,
    on = 1,
}

export enum PowerSaveParameter {
    off = 0,
    on = 1,
}

export enum SafetyHeatingParameter {
    off = 0,
    on = 1,
}
