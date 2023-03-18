<script>
import { data } from './data.js'
import { getCenter, getDistance, isTouchEnabled, scaleBy, newObject } from './util.js'
import * as defaults from './defaultObjects';
export default {
  data() {
    return {
      currentShapeId: 0,
      data,
      copiedObject: null,
      selectedShapeObject: null,
      lastCenter: null,
      lastDist: 0,
      stageConfig: {
        draggable: !isTouchEnabled()
      }
    };
  },
  computed: {
    rectangles() {
      return this.data.shapes.filter((r) => {
        return r.name.split('_')[0] === "object";
      });
    },
    circles(){
      return this.data.shapes.filter((r) => {
        return r.name.split('_')[0] === "pointsource";
      });
    }
  },
  methods: {
    globalTransform(func) {
      let stage = this.$refs.transformer.getNode().getStage();
      let a = stage.position();
      let b = stage.scale();
      stage.scale({ x: 1, y: 1 });
      stage.position({ x: 0, y: 0 });
      func()
      stage.scale(b);
      stage.position(a);
    },
    //mobile
    handleTouch(e) {
      e.evt.preventDefault();
      var touch1 = e.evt.touches[0];
      var touch2 = e.evt.touches[1];
      const stage = this.$refs.transformer.getNode().getStage();
      if (stage == null) {
        return;
      }
      if (touch1 && touch2) {
        if (stage.isDragging()) {
          stage.stopDrag();
        }

        var p1 = {
          x: touch1.clientX,
          y: touch1.clientY
        };
        var p2 = {
          x: touch2.clientX,
          y: touch2.clientY
        };

        if (!this.lastCenter) {
          this.lastCenter = getCenter(p1, p2);
          return;
        }
        var newCenter = getCenter(p1, p2);

        var dist = getDistance(p1, p2);

        if (!this.lastDist) {
          this.lastDist = dist;
        }

        // local coordinates of center point
        var pointTo = {
          x: (newCenter.x - stage.x()) / stage.scaleX(),
          y: (newCenter.y - stage.y()) / stage.scaleX()
        };

        var scale = stage.scaleX() * (dist / this.lastDist);

        stage.scaleX(scale);
        stage.scaleY(scale);

        // calculate new position of the stage
        var dx = newCenter.x - this.lastCenter.x;
        var dy = newCenter.y - this.lastCenter.y;

        var newPos = {
          x: newCenter.x - pointTo.x * scale + dx,
          y: newCenter.y - pointTo.y * scale + dy
        };

        stage.position(newPos);
        stage.batchDraw();

        this.lastDist = dist;
        this.lastCenter = newCenter;
      }
    },
    handleTouchEnd(e) {
      this.lastCenter = null;
      this.lastDist = 0;
    },
    updateSize(x, y) {
      let stage = this.$refs.transformer.getNode().getStage();
      stage.width(x);
      stage.height(y);
    },
    zoomStage(event) {
      event.evt.preventDefault();
      const stage = this.$refs.transformer.getNode().getStage();
      if (stage == null) {
        return;
      }
      const oldScale = stage.scaleX();
      const { x: pointerX, y: pointerY } = stage.getPointerPosition();
      const mousePointTo = {
        x: (pointerX - stage.x()) / oldScale,
        y: (pointerY - stage.y()) / oldScale,
      };
      const newScale = event.evt.deltaY > 0 ? oldScale / scaleBy : oldScale * scaleBy;
      stage.scale({ x: newScale, y: newScale });
      const newPos = {
        x: pointerX - mousePointTo.x * newScale,
        y: pointerY - mousePointTo.y * newScale,
      }
      stage.position(newPos);
      stage.batchDraw();
    },
    handleDragend(e) {
      if (!this.selectedShapeObject) return;
      if (this.selectedShapeObject.name.split('_')[0] === "object") {
        this.globalTransform(() => {
          this.selectedShapeObject.x = e.target.x();
          this.selectedShapeObject.y = e.target.y();
        })
      }
      else if (this.selectedShapeObject.name.split('_')[0] === "pointsource") {
        this.globalTransform(() => {
          this.selectedShapeObject.x = e.target.x() + this.selectedShapeObject.radius * this.selectedShapeObject.scaleX;
          this.selectedShapeObject.y = e.target.y() + this.selectedShapeObject.radius * this.selectedShapeObject.scaleY;
        })
      }
    },
    handleTransformEnd(e) {
      if (this.selectedShapeObject) {
        this.selectedShapeObject.x = e.target.x();
        this.selectedShapeObject.y = e.target.y();
        this.selectedShapeObject.scaleX = e.target.scaleX();
        this.selectedShapeObject.scaleY = e.target.scaleY();
      }
    },
    handleStageMouseDown(e) {
      // clicked on stage - clear selection
      if (e.target === e.target.getStage()) {
        this.selectedShapeObject = null;
        this.updateTransformer();
        return;
      }
      // clicked on transformer - do nothing
      const clickedOnTransformer =
        e.target.getParent().className === 'Transformer';
      if (clickedOnTransformer) {
        return;
      }
      // find clicked object by its name
      const name = e.target.name();
      this.selectedShapeObject = this.data.shapes.find((r) => r.name === name);
      this.updateTransformer();
    },
    updateTransformer() {
      // here we need to manually attach or detach Transformer node
      const transformerNode = this.$refs.transformer.getNode();
      const stage = transformerNode.getStage();
      let name = '';
      if (this.selectedShapeObject) name = this.selectedShapeObject.name;
      const selectedNode = stage.findOne('.' + name);
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
    addRect() {
      this.currentShapeId++;
      this.data.shapes.push({
        ...JSON.parse(JSON.stringify(defaults.defaultRect)),
        name: `object_${this.currentShapeId}`
      })
    },
    addCircle() {
      this.currentShapeId++;
      this.data.shapes.push({
        ...JSON.parse(JSON.stringify(defaults.defaultCircle)),
        name: `pointsource_${this.currentShapeId}`
      })
    },
    deleteShape() {
      //Is there a more efficient way?
      this.data.shapes = this.data.shapes.filter((r) => {
        return r.name !== this.selectedShapeObject.name;
      });
      this.selectedShapeObject = null;
      this.updateTransformer();
    }
  },
  mounted() {
    //todo fix hard coded size
    // todo limit shape dragging to simulation canvas
    this.data.xBounds = 500;
    this.data.yBounds = 500;
    window.addEventListener('keydown', e => {
      const key = e.key;
      if (!this.selectedShapeObject) return;
      switch (key) {
        case "Delete":
          this.deleteShape();
          break;
        case "ArrowLeft":
          this.globalTransform(() => {
            this.selectedShapeObject.x--;
          })
          break;
        case "ArrowUp":
          this.globalTransform(() => {
            this.selectedShapeObject.y--;
          })
          break;
        case "ArrowRight":
          this.globalTransform(() => {
            this.selectedShapeObject.x++;
          })
          break;
        case "ArrowDown":
          this.globalTransform(() => {
            this.selectedShapeObject.y++;
          })
          break;
        /*
        case "c":
          if(!e.ctrlKey||!this.selectedShapeObject) break;
          this.copiedObject=JSON.parse(JSON.stringify(this.selectedShapeObject));
          this.selectedShapeObject=null;
          break;
        case "v":
          if(!e.ctrlKey||!this.copiedObject) break;
          const name = this.copiedObject.name.split('_')[0];
          if(name === "pointsource"){
            this.data.circles.push(JSON.parse(JSON.stringify(this.copiedObject)));
          }
          else if(name === "object"){
            this.data.rectangles.push(JSON.parse(JSON.stringify(this.copiedObject)));
          }
          break;
        */
      }
    });
    //todo CTRL+C, CTRL+V

  }
};
</script>
<template>
  <!-- export addrect, import RECT ARRAY from other files -->
  <!-- TODO: Make all objects in one array and then add computed property that gets all rectangles/circles for displaying on konva canvas-->
  <div>
    <v-stage ref="stage" :config="stageConfig" @mousedown="handleStageMouseDown" @touchstart="handleStageMouseDown"
      @dragend="handleDragend" @touchmove="handleTouch" @touchend="handleTouchEnd" @wheel="zoomStage"
      @keydown.delete="deleteShape">
      <v-layer ref="layer">
        <v-rect :config="{
          x: 0,
          y: 0,
          width: 500,
          height: 500,
          opacity: 0.1,
          fill: 'gray',
          perfectDrawEnabled: false
        }" />
        <v-rect v-for="item in rectangles" :key="item.id" :config="item" @transformend="handleTransformEnd">
        </v-rect>
        <v-circle v-for="item in circles" :key="item.id" :config="item" @transformend="handleTransformEnd">
        </v-circle>
        <v-transformer ref="transformer" />
      </v-layer>
    </v-stage>
  </div>
</template>