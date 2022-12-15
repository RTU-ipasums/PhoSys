import { reactive } from 'vue'

export const data = reactive({
    xBounds:null,
    yBounds:null,
    rectangles: [
        // {
        //   rotation: 0,
        //   x: 10,
        //   y: 10,
        //   width: 100,
        //   height: 100,
        //   scaleX: 1,
        //   scaleY: 1,
        //   fill: 'red',
        //   name: 'object_1',
        //   draggable: true,
        // }
      ],
      circles:[
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