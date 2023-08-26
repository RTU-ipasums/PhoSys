<script>
import { data } from './data.js'
import { getCenter, getDistance, isTouchEnabled, scaleBy, newObject, radToDeg, degToRad} from './util.js'
import DraggableLine from './shapes/DraggableLine.vue'
import Rectangle from './shapes/Rectangle.vue'
import Circle from './shapes/Circle.vue'
import Polygon from './shapes/Polygon.vue'
export default {
  components: {
    DraggableLine,
    Rectangle,
    Circle,
    Polygon
  },
  data() {
    return {
      currentShapeId: 0,
      copiedShapes: new Set(),
      selectedShapes: new Set(),
      lastCenter: null,
      lastDist: 0,
      stageConfig: {
        draggable: !isTouchEnabled()
      },
      ctrlKeyPressed:false,
      rotationSnaps:[0,22.5,45,67.5,90,112.5,135,157.5,180,202.5,225,247.5,270,292.5,315,337.5]
    };
  },
  computed: {
    rectangles() {
      return data.shapes.filter((r) => {
        return r.name.split('_')[0] === "object";
      });
    },
    circles() {
      return data.shapes.filter((r) => {
        return r.name.split('_')[0] === "pointsource";
      });
    },
    lines() {
      return data.shapes.filter((r) => {
        return r.name.split('_')[0] === "linesource";
      });
    },
    linedetectors() {
      return data.shapes.filter((r) => {
        return r.name.split('_')[0] === "linedetector";
      });
    },
    polygons() {
      return data.shapes.filter((r) => {
        return r.name.split('_')[0] === "polygon";
      });
    }
  },
  methods: {
    //mobile
    handleTouch(e) {
      e.evt.preventDefault();
      var touch1 = e.evt.touches[0];
      var touch2 = e.evt.touches[1];
      const stage = this.$refs.stage.getStage();
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
    handleZoomStage(e) {
      e.evt.preventDefault();
      const stage = this.$refs.stage.getStage();
      if (stage == null) {
        return;
      }
      const oldScale = stage.scaleX();
      const { x: pointerX, y: pointerY } = stage.getPointerPosition();
      const mousePointTo = {
        x: (pointerX - stage.x()) / oldScale,
        y: (pointerY - stage.y()) / oldScale,
      };
      const newScale = e.evt.deltaY > 0 ? oldScale / scaleBy : oldScale * scaleBy;
      stage.scale({ x: newScale, y: newScale });
      const newPos = {
        x: pointerX - mousePointTo.x * newScale,
        y: pointerY - mousePointTo.y * newScale,
      }
      stage.position(newPos);

      let shapes = stage.find('#static');
      for (const shape of shapes) {
        shape.scale({
          x:1/newScale,
          y:1/newScale
        })
      }
      stage.batchDraw();
    },
    handleStageMouseDown(e) {
      // clicked on transformer - do nothing
      const clickedOnTransformer =
        e.target.getParent()?.className === 'Transformer';
      if (clickedOnTransformer) {
        return;
      }
      // find clicked object by its name
      //TODO: the solution of finding the parent for grouped objects isn't optimal
      let name = e.target.name() || e.target.getParent()?.name();
      if (!name) {
        return;
      }
      const shape = data.shapes.find((r) => r.name === name);
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
      if (e.target === this.$refs.stage.getStage()) {
        
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
      //TODO: the solution of finding the parent for grouped objects isn't optimal
      let name = e.target.name() || e.target.getParent()?.name();
      if (!name) {
        return;
      }
      const shape = data.shapes.find((r) => r.name === name);

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
      const stage = this.$refs.stage.getStage();

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
      if(this.selectedShapes.size === 1 && [...this.selectedShapes][0].name.startsWith("object_")){
        transformerNode.resizeEnabled(true);
        transformerNode.rotateEnabled(true);
      }
      else{
        transformerNode.resizeEnabled(false);
        transformerNode.rotateEnabled(false);
      }
    },
    updateSize(x, y) {
      let stage = this.$refs.stage.getStage();
      stage.width(x);
      stage.height(y);
    },
    snappingFunction(oldBoundBox, newBoundBox){
      if (this.ctrlKeyPressed) {
        //convert to rotation in range 0-2pi rad
        newBoundBox.rotation=((newBoundBox.rotation % (2 * Math.PI)) + (2 * Math.PI)) % (2 * Math.PI);
        oldBoundBox.rotation=((oldBoundBox.rotation % (2 * Math.PI)) + (2 * Math.PI)) % (2 * Math.PI);
        //TODO: This is inefficient
        const closestSnap = this.rotationSnaps.reduce((a, b) => {
          return Math.abs(b - radToDeg(newBoundBox.rotation)) < Math.abs(a - radToDeg(newBoundBox.rotation)) ? b : a;
        });
        const diff = degToRad(closestSnap) - oldBoundBox.rotation;
        if (Math.abs(diff) > 0) {
          const center = {
            x: oldBoundBox.x + oldBoundBox.width / 2 * Math.cos(oldBoundBox.rotation) +
                               oldBoundBox.height / 2 * Math.sin(-oldBoundBox.rotation),
            y: oldBoundBox.y + oldBoundBox.height / 2 * Math.cos(oldBoundBox.rotation) +
                               oldBoundBox.width / 2 * Math.sin(oldBoundBox.rotation)
          }
          const newPos = {
            x: Math.round(center.x + (oldBoundBox.x - center.x) * Math.cos(diff) -
                                          (oldBoundBox.y - center.y) * Math.sin(diff)),
            y: Math.round(center.y + (oldBoundBox.x - center.x) * Math.sin(diff) +
                                          (oldBoundBox.y - center.y) * Math.cos(diff))
          }
          return {
            ...oldBoundBox,
            rotation: oldBoundBox.rotation + diff,
            x:newPos.x,
            y:newPos.y
          };
        }
        return oldBoundBox;
      }
      return newBoundBox;
    },
    addShape(obj, type, keepSelected) {
      this.currentShapeId++;
      data.shapes.push({
        ...newObject(obj),
        name: `${type}_${this.currentShapeId}`
      })
      if(!keepSelected){
        this.selectedShapes.clear();
      }
      this.selectedShapes.add(data.shapes.at(-1));
      Promise.resolve(this.selectedShapes).then(this.updateTransformer);
    },
    deleteSelectedShapes() {
      data.shapes = data.shapes.filter((shape) =>!this.selectedShapes.has(shape));
      this.selectedShapes.clear();
      this.updateTransformer();
    }
  },
  mounted() {
    //todo limit shape dragging to simulation canvas
    data.xBounds = 500;
    data.yBounds = 500;
    window.addEventListener('keydown', e => {
      const key = e.key;
      switch (key) {
        case "Delete":
          this.deleteSelectedShapes();
          break;
        case "Control":
          this.ctrlKeyPressed=true;
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
          this.copiedShapes=new Set(newObject([...this.selectedShapes]));
          break;
        case "v":
          if (!e.ctrlKey || this.copiedShapes.length === 0) break;
          this.selectedShapes.clear();
          for (const obj of this.copiedShapes) {
            
            obj.x += 10;
            obj.y += 10;
            
            this.addShape(obj, obj.name.split('_')[0], true);
          }
        }
    });
    window.addEventListener('keyup', e=>{
      const key = e.key;
      switch (key) {
        case "Control":
          this.ctrlKeyPressed=false;
          break;
      }
    });
    window.addEventListener('blur', e=>{
      this.ctrlKeyPressed = false;
    });
  }
};
</script>
<template>
  <!-- export addrect, import RECT ARRAY from other files -->
  <div>
    <v-stage ref="stage" :config="stageConfig" 
      @mousedown="handleStageMouseDown" @touchstart="handleStageMouseDown"
      @click="handleStageClick" @tap="handleStageClick" 
      @touchmove="handleTouch" 
      @touchend="handleTouchEnd" 
      @wheel="handleZoomStage" 
      @keydown.delete="deleteSelectedShapes">
      <v-layer ref="layer">
        <v-rect :config="{
          x: 0,
          y: 0,
          width: 500,
          height: 500,
          opacity: 0.1,
          fill: 'gray',
          perfectDrawEnabled: false,
          listening: false
        }" />

        <Circle v-for="item in circles" :key="item.id" :config="item"/>
        <DraggableLine v-for="item in lines" :key="item.id" :config="{...item,color:'blue'}" @sizeupdate="updateTransformer"/>
        <DraggableLine v-for="item in linedetectors" :key="item.id" :config="{...item, color:'green'}" @sizeupdate="updateTransformer"/>
        <Rectangle v-for="item in rectangles" :key="item.id" :config="item"/>
        <Polygon v-for="item in polygons" :key="item.id" :config="item"/>
        <v-transformer ref="transformer" 
        :config="{
          boundBoxFunc: snappingFunction
        }"/>

      </v-layer>
    </v-stage>
  </div>
</template>