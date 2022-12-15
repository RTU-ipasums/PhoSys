<script>
let width = 500;
let height = 911;
import {data} from './data.js'

export default {
  data() {
    return {
      currentShapeId: 0,
      stageSize: {
        width: width,
        height: height,
      },
      data,
      selectedShapeName: '',
      Shapes: {
        Rectangle: 0,
        Circle: 1
      }
    };
  },
  methods: {
    handleDragend(e) {
      this.data.rectangles.forEach(r => {
        if(r.name === this.selectedShapeName){
          r.x = e.target.x();
          r.y = e.target.y();
        }
      });
      this.data.circles.forEach(r => {
        if(r.name === this.selectedShapeName){
          r.x = e.target.x()+r.radius*r.scaleX;
          r.y = e.target.y()+r.radius*r.scaleY;
        }
      });
    },
    handleTransformEnd(e) {
      this.data.rectangles.concat(this.data.circles).forEach(r => {
        if(r.name === this.selectedShapeName){
          r.scaleX = e.target.scaleX();
          r.scaleY = e.target.scaleY();
        }
      });
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
      const rect = this.data.rectangles.concat(this.data.circles).find((r) => r.name === name);
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
    },
    addCircle(){
      console.log(this.data.circles)
      this.currentShapeId++;
      this.data.circles.push({
        rotation: 0,
        x: 150,
        y: 150,
        radius:15,
        scaleX: 1,
        scaleY: 1,
        fill: 'blue',
        opacity: 0.5,
        name: `pointsource_${this.currentShapeId}`,
        draggable: true,
      })
    },
    deleteShape(){
      this.data.rectangles = this.data.rectangles.filter((r) => {
          return r.name !== this.selectedShapeName;
      });
      this.data.circles = this.data.circles.filter((r) => {
          return r.name !== this.selectedShapeName;
      });
      this.selectedShapeName = '';
      this.updateTransformer();
    }
  },
  mounted() {
    let stage = this.$refs.transformer.getNode().getStage();
    stage.width(document.querySelector('.editor').offsetWidth);
    stage.height(document.querySelector('.editor').offsetHeight);

    this.data.xBounds=document.querySelector('.editor').offsetWidth;
    this.data.yBounds=document.querySelector('.editor').offsetHeight;
    window.addEventListener('keydown', e=>{
      const key = e.key;
      if (key === "Backspace" || key === "Delete") {
        this.deleteShape();
      }
    });
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
          @transformend="handleTransformEnd">
        </v-rect>
        <v-circle
          v-for="item in data.circles"
          :key="item.id"
          :config="item"
          @transformend="handleTransformEnd">
        </v-circle>
        <v-transformer ref="transformer" />
      </v-layer>
    </v-stage>
  </div>
</template>