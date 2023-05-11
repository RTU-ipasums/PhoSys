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
        // {
        //   rotation: 0,
        //   x: 5,
        //   y: 10,
        //   width: 100,
        //   height: 150,
        //   scaleX: 1,
        //   scaleY: 2,
        //   fill: 'red',
        //   name: 'object_1',
        //   draggable: true,
        // },
        // {
        //   rotation: 0,
        //   x: 10,
        //   y: 10,
        //   radius: 15,
        //   scaleX: 1,
        //   scaleY: 1,
        //   fill: 'red',
        //   name: 'pointsource_1',
        //   draggable: true,
        // }
      ]
})