import { reactive } from 'vue'

export const data = reactive({
    xBounds:null,
    yBounds:null,
    propertyTitle:"Global settings",
    properties:[
    {
        propertyName:"Framecount",
        min:1,
        max:10000,
        value:200
    },
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