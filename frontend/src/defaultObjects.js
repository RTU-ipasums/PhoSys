export const defaultObject = {
    rotation: 0,
    x: 150,
    y: 150,
    width: 100,
    height: 100,
    scaleX: 1,
    scaleY: 1,
    fill: 'red',
    opacity: 0.3,
    perfectDrawEnabled: false,
    draggable: true,
    propertyTitle: "Rectangle object",
    properties: [
        {
            propertyName: "Permittivity",
            units: "su",
            min: 0,
            max: 100,
            value: 25
        },
        {
            propertyName: "Conductivity",
            units: "S/m",
            min: 0,
            max: 30000,
            value: 0
        },
    ]
};
export const defaultPointsource = {
    rotation: 0,
    x: 150,
    y: 150,
    radius: 15,
    scaleX: 1,
    scaleY: 1,
    fill: 'blue',
    opacity: 0.5,
    perfectDrawEnabled: false,
    draggable: true,
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
    points:[100,100,200,200],
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