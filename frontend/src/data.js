import { reactive } from 'vue'

export const data = reactive({
    xBounds:null,
    yBounds:null,
    frameCount:20,
    propertyTitle:"Global settings",
    properties:[
    {
        propertyName:"Permittivity",
        min:1,
        max:100,
        value:5
    },
    {
        propertyName:"Permeability",
        min:0,
        max:100,
        value:1
    }
    ],
    shapes: [],
    currentFrame: 1,
    views:{
      "Main view": {
          type:"view",
          data:[],
          canvas:null,
        },
      "Detector 1":{
          type:"detector",
          data:[],
          canvas:null,
        }
    },
})

