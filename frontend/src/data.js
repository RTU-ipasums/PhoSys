import { reactive } from 'vue'

export const data = reactive({
    xBounds:null,
    yBounds:null,
    frameCount:200,
    propertyTitle:"Global settings",
    properties:[
    {
        propertyName:"Permittivity",
        min:0,
        max:100,
        value:5
    },
    {
        propertyName:"Permiability",
        min:0,
        max:100,
        value:1
    }
    ],
    shapes: [
      ]
})