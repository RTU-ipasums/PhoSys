export const defaultObject = {
    rotation: 0,
    x: 150,
    y: 150,
    width: 100,
    height: 100,
    scaleX: 1,
    scaleY: 1,
    propertyTitle: "Rectangle object",
    properties: [
        {
            propertyName: "Permittivity",
            units: "su",
            min: 1,
            max: 100,
            value: 25
        },
        {
            propertyName: "Conductivity, S/m",
            units: "S/m",
            min: 0,
            max: 30000,
            value: 0
        },
    ]
};
export const defaultPolygon = {
    rotation: 0,
    x: 150,
    y: 150,
    points: [23, 20, 23, 160, 70, 93, 150, 109, 290, 139, 270, 93],
    scaleX: 1,
    scaleY: 1,
    propertyTitle: "Polygon object",
    properties: [
        {
            propertyName: "Permittivity",
            units: "su",
            min: 1,
            max: 100,
            value: 25
        },
        {
            propertyName: "Conductivity, S/m",
            units: "S/m",
            min: 0,
            max: 30000,
            value: 0
        },
    ]
};
export const defaultPointsource = {
    x: 150,
    y: 150,
    radius: 15,
    scaleX: 1,
    scaleY: 1,
    propertyTitle: "Point source light",
    properties: [{
        propertyName: "Wavelength, nm",
        units: "nm",
        min: 100,
        max: 1600,
        _value: 1.5e-6,
        set value(x) {
            this._value = x / 1e9;
        },
        get value() {
            return this._value * 1e9;
        }
    },
    {
        propertyName: "Amplitude",
        units: "su",
        min: 1,
        max: 100,
        value: 10
    },
    {
        propertyName: "Phase shift, degrees",
        units: "°",
        min: -180,
        max: 180,
        value: 0
    }
    ]
}
export const defaultLinesource = {
    x:100,
    y:100,
    points:[0,0,100,100],
    propertyTitle: "Line source light",
    properties: [{
        propertyName: "Wavelength, nm",
        units: "nm",
        min: 100,
        max: 1600,
        _value: 1.5e-6,
        set value(x) {
            this._value = x / 1e9;
        },
        get value() {
            return this._value * 1e9;
        }
    },
    {
        propertyName: "Amplitude",
        units: "su",
        min: 50,
        max: 500,
        value: 175
    },
    {
        propertyName: "Phase shift, degrees",
        units: "°",
        min: -180,
        max: 180,
        value: 0
    }
    ]
}

export const defaultLinedetector = {
    x:100,
    y:100,
    points:[0,0,100,100],
    propertyTitle: "Line detector"
}