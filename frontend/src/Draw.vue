<script>
import { data } from './data.js'
import { getCenter, getDistance, isTouchEnabled, scaleBy, newObject } from './util.js'
export default {
  data() {
    return {
      currentShapeId: 0,
      data,
      copiedShapes: new Set(),
      selectedShapes: new Set(),
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
    circles() {
      return this.data.shapes.filter((r) => {
        return r.name.split('_')[0] === "pointsource";
      });
    },
    lines() {
      return this.data.shapes.filter((r) => {
        return r.name.split('_')[0] === "linesource";
      });
    }
  },
  methods: {
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
      const name = e.target.name();
      const selectedShape = this.data.shapes.find((r) => r.name === name);
      if (!selectedShape) return;
      selectedShape.x = e.target.x();
      selectedShape.y = e.target.y();
    },
    handleTransformEnd(e) {
      const name = e.target.name();
      const selectedShape = this.data.shapes.find((r) => r.name === name);
      if (!selectedShape) return;
      selectedShape.x = e.target.x();
      selectedShape.y = e.target.y();
      selectedShape.scaleX = e.target.scaleX();
      selectedShape.scaleY = e.target.scaleY();
    },
    handleStageMouseDown(e) {
      // clicked on transformer - do nothing
      const clickedOnTransformer =
        e.target.getParent()?.className === 'Transformer';
      if (clickedOnTransformer) {
        return;
      }
      // find clicked object by its name
      const name = e.target.name();
      const shape = this.data.shapes.find((r) => r.name === name);
      if (shape) {
        if (!e.evt.shiftKey && !this.selectedShapes.has(shape)) {
          this.selectedShapes.clear();
          this.selectedShapes.add(shape);
        }
      }
      this.updateTransformer();
    },
    handleStageClick(e) {
      // clicked on stage - clear selection
      if (e.target === e.target.getStage()) {
        this.selectedShapes.clear();
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
      const shape = this.data.shapes.find((r) => r.name === name);
      if (!shape) {
        this.selectedShapes.clear();
      }
      else {
        if (e.evt.shiftKey) {
          if (!this.selectedShapes.has(shape)) {
            this.selectedShapes.add(shape);
          } else {
            this.selectedShapes.delete(shape);
          }
        }
        else {
          this.selectedShapes.clear();
          this.selectedShapes.add(shape);
        }
      }
      this.updateTransformer();
    },
    updateTransformer() {
      // here we need to manually attach or detach Transformer node
      const transformerNode = this.$refs.transformer.getNode();
      const stage = transformerNode.getStage();
      let selectedNodes = [];
      for (const selectedShape of this.selectedShapes) {
        selectedNodes.push(stage.findOne('.' + selectedShape.name));
      }
      if (selectedNodes && selectedNodes.length !== 0) {
        // attach to another node
        transformerNode.nodes(selectedNodes);
      } else {
        // remove transformer
        transformerNode.nodes([]);
      }
    },
    addShape(obj, type) {
      this.currentShapeId++;
      this.data.shapes.push({
        ...newObject(obj),
        name: `${type}_${this.currentShapeId}`
      })
      this.selectedShapes.clear();
      this.selectedShapes.add(this.data.shapes.at(-1));
      Promise.resolve(this.selectedShapes).then(this.updateTransformer);
    },
    deleteSelectedShapes(obj) {
      this.data.shapes.filter((shape) => !selectedShapes.has(shape));
      this.selectedShapes.clear();
      this.updateTransformer();
    }
  },
  mounted() {
    //todo fix hard coded size
    //todo limit shape dragging to simulation canvas
    //todo store shapes in sets, computed property to turn into json
    this.data.xBounds = 500;
    this.data.yBounds = 500;
    window.addEventListener('keydown', e => {
      const key = e.key;
      switch (key) {
        case "Delete":
          this.deleteSelectedShapes();
          break;
        case "ArrowLeft":
          for (const obj of this.selectedShapes) {
            obj.x = Math.floor(obj.x - 0.0001);
          };
          break;
        case "ArrowUp":
          for (const obj of this.selectedShapes) {
            obj.y = Math.floor(obj.y - 0.0001);
          };
          break;
        case "ArrowRight":
          for (const obj of this.selectedShapes) {
            obj.x = Math.ceil(obj.x + 0.0001);
          };
          break;
        case "ArrowDown":
          for (const obj of this.selectedShapes) {
            obj.y = Math.ceil(obj.y + 0.0001);
          };
          break;
        case "c":
          if (!e.ctrlKey || this.selectedShapes.size === 0) break;
          this.copiedShapes.clear();
          this.copiedShapes.add(newObject(...this.selectedShapes));
          break;
        case "v":
          if (!e.ctrlKey || this.copiedShapes.length === 0) break;
          for (const obj of this.copiedShapes) {
            obj.x += 10;
            obj.y += 10;
            this.addShape(obj, obj.name.split('_')[0]);
          }
        }
    });
  }
};
</script>
<template>
  <!-- export addrect, import RECT ARRAY from other files -->
  <div>
    <v-stage ref="stage" :config="stageConfig" @mousedown="handleStageMouseDown" @touchstart="handleStageMouseDown"
      @click="handleStageClick" @dragstart="handleDragstart" @dragend="handleDragend" @touchmove="handleTouch"
      @touchend="handleTouchEnd" @wheel="zoomStage" @keydown.delete="deleteSelectedShapes">
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
        <v-line v-for="item in lines" :key="item.id" :config="item" @transformend="handleTransformEnd">
        </v-line>
        <v-transformer ref="transformer" />
      </v-layer>
    </v-stage>
  </div>
</template>