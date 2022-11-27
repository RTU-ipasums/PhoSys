<script>
let width = 950;
let height = 911;
import {data} from './data.js'
// export default {
//   data() {
//     return {
//       list: [],
//       objectId:0,
//       dragItemId: null,
//       configKonva: {
//         width: width,
//         height: height
//       }
//     };
//   },
//   methods: {
//     handleDragstart(e) {
//       // save drag element:
//       this.dragItemId = e.target.id();
//       // move current element to the top:
//       const item = this.list.find(i => i.id === this.dragItemId);
//       const index = this.list.indexOf(item);
//       this.list.splice(index, 1);
//       this.list.push(item);
//     },
//     handleDragend(e) {
//       this.dragItemId = null;
//     },
//     addRect(){
//       this.objectId++;
//       this.list.push({
//         id:this.objectId,
//         x:150,
//         y:150,
//         width:50,
//         height:50
//       })
//     }
//   },
//   mounted() {
//   }
// };
export default {
  data() {
    return {
      currentShapeId: 2,
      stageSize: {
        width: width,
        height: height,
      },
      data,
      lines:[],
      selectedShapeName: ''
    };
  },
  methods: {
    handleDragend(e) {
      const rect = this.data.rectangles.find(
        (r) => r.name === this.selectedShapeName
      );
      rect.x = e.target.x();
      rect.y = e.target.y();
      //rect.fill = Konva.Util.getRandomColor();
    },
    handleTransformEnd(e) {
      // shape is transformed, let us save new attrs back to the node
      // find element in our state
      const rect = this.data.rectangles.find(
        (r) => r.name === this.selectedShapeName
      );
      // update the state
      rect.x = e.target.x();
      rect.y = e.target.y();
      rect.scaleX = e.target.scaleX();
      rect.scaleY = e.target.scaleY();

      // change fill
      //rect.fill = Konva.Util.getRandomColor();
    },
    handleStageMouseDown(e) {
      // clicked on stage - clear selection
      if (e.target === e.target.getStage()) {
        this.selectedShapeName = '';
        this.updateTransformer();
        return;
      }

      // clicked on transformer - do nothing
      const clickedOnTransformer =
        e.target.getParent().className === 'Transformer';
      if (clickedOnTransformer) {
        return;
      }

      // find clicked rect by its name
      const name = e.target.name();
      const rect = this.data.rectangles.find((r) => r.name === name);
      if (rect) {
        this.selectedShapeName = name;
      } else {
        this.selectedShapeName = '';
      }
      this.updateTransformer();
    },
    updateTransformer() {
      // here we need to manually attach or detach Transformer node
      const transformerNode = this.$refs.transformer.getNode();
      const stage = transformerNode.getStage();
      const { selectedShapeName } = this;

      const selectedNode = stage.findOne('.' + selectedShapeName);
      // do nothing if selected node is already attached
      if (selectedNode === transformerNode.node()) {
        return;
      }
      if (selectedNode) {
        // attach to another node
        transformerNode.nodes([selectedNode]);
      } else {
        // remove transformer
        transformerNode.nodes([]);
      }
    },
    addRect(){
      console.log(this.data.rectangles)
      this.currentShapeId++;
      this.data.rectangles.push({
        rotation: 0,
        x: 150,
        y: 150,
        width: 100,
        height: 100,
        scaleX: 1,
        scaleY: 1,
        fill: 'red',
        opacity: 0.3,
        name: `object_${this.currentShapeId}`,
        draggable: true,
      })
    }
  },
  mounted() {
    width=document.querySelector('.u-i-leftarea').offsetWidth;
    height = document.querySelector('.u-i-leftarea').offsetHeight;
    this.data.xBounds=width;
    this.data.yBounds=height
  }
};
</script>

<style>
body {
  margin: 0;
  padding: 0;
}
</style>
<template>
  <!-- export addrect, import RECT ARRAY from other files -->
  <div>
    <v-stage
      ref="stage"
      :config="stageSize"
      @mousedown="handleStageMouseDown"
      @touchstart="handleStageMouseDown"
      @dragend="handleDragend"
    >
      <v-layer ref="layer">
        <v-rect
          v-for="item in data.rectangles"
          :key="item.id"
          :config="item"
          @transformend="handleTransformEnd"
        ></v-rect>
        <v-line
          v-for="item in lines"
          :key="item.id"
          :config="item"
          @transformend="handleTransformEnd">
        </v-line>
        <v-transformer ref="transformer" />
      </v-layer>
    </v-stage>
  </div>
</template>