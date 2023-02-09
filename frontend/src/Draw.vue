<script>
import {data} from './data.js'
import {getCenter,getDistance,isTouchEnabled,scaleBy} from './util.js'
export default {
  data() {
    return {
      currentShapeId: 0,
      data,
      selectedShapeObject:null,
      lastCenter:null,
      lastDist:0,
      stageConfig:{
        draggable:!isTouchEnabled()
      }
    };
  },
  methods: {
    globalTransform(func){
      let stage=this.$refs.transformer.getNode().getStage();
      let a = stage.position();
      let b = stage.scale();
      stage.scale({x:1,y:1});
      stage.position({x:0,y:0});
      func()
      stage.scale(b);
      stage.position(a);
    },
    //mobile
    handleTouch(e){
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
    handleTouchEnd(e){
      this.lastCenter = null;
      this.lastDist = 0;
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
      if(!this.selectedShapeObject)return;
      if(this.selectedShapeObject.name.split('_')[0]==="object"){
        this.globalTransform(()=>{
          this.selectedShapeObject.x = e.target.x();
          this.selectedShapeObject.y = e.target.y();
        })
      }
      else if(this.selectedShapeObject.name.split('_')[0]==="pointsource"){
        this.globalTransform(()=>{
            this.selectedShapeObject.x = e.target.x()+this.selectedShapeObject.radius*this.selectedShapeObject.scaleX;
            this.selectedShapeObject.y = e.target.y()+this.selectedShapeObject.radius*this.selectedShapeObject.scaleY;
          })
      }
    },
    handleTransformEnd(e) {
      if(this.selectedShapeObject){
        this.selectedShapeObject.scaleX = e.target.scaleX();
        this.selectedShapeObject.scaleY = e.target.scaleY();
      }
    },
    handleStageMouseDown(e) {
      // clicked on stage - clear selection
      if (e.target === e.target.getStage()) {
        this.selectedShapeObject=null;
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
      this.selectedShapeObject=this.data.rectangles.concat(this.data.circles).find((r) => r.name === name);
      this.updateTransformer();
    },
    updateTransformer() {
      // here we need to manually attach or detach Transformer node
      const transformerNode = this.$refs.transformer.getNode();
      const stage = transformerNode.getStage();
      let name='';
      if(this.selectedShapeObject)name=this.selectedShapeObject.name;
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
    addRect(){
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
        perfectDrawEnabled:false,
        draggable: true,
        propertyTitle:"Rectangle object",
        properties:[  
        {
          propertyName:"Permittivity",
          units:"su",
          min:0,
          max:100,
          value:0
        }     
        ]
      })
    },
    addCircle(){
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
        perfectDrawEnabled:false,
        draggable: true,
        propertyTitle:"Point source light",
        properties:[{
          propertyName:"Wavelength",
          units:"nm",
          min:100,
          max:1600,
          _value:1.5e-6,
          set value(x){
            this._value=x/1e9;
          },
          get value(){
            return this._value*1e9;
          }
        },
        {
          propertyName:"Amplitude",
          units:"su",
          min:1,
          max:100,
          value:10
        },
        {
          propertyName:"Phase shift",
          units:"°",
          min:0,
          value:0
        }
      ]
      })
    },
    deleteShape(){
      //Is there a more efficient way?
      this.data.rectangles = this.data.rectangles.filter((r) => {
          return r.name !== this.selectedShapeObject.name;
      });
      this.data.circles = this.data.circles.filter((r) => {
          return r.name !== this.selectedShapeObject.name;
      });
      this.selectedShapeObject = null;
      this.updateTransformer();
    },
    updateSize(x, y){
      let stage = this.$refs.transformer.getNode().getStage();
      stage.width(x);
      stage.height(y);
    }
  },
  mounted() {
    //todo fix hard coded size
    // todo limit shape dragging to simulation canvas
    this.data.xBounds=500;
    this.data.yBounds=500;
    window.addEventListener('keydown', e=>{
      const key = e.key;
      if (key === "Delete") {
        this.deleteShape();
      }
    });
  }
};
</script>
<template>
  <!-- export addrect, import RECT ARRAY from other files -->
  <div>
    <v-stage
      ref="stage"
      :config="stageConfig"
      @mousedown="handleStageMouseDown"
      @touchstart="handleStageMouseDown"
      @dragend="handleDragend"
      @touchmove="handleTouch"
      @touchend="handleTouchEnd"
      @wheel="zoomStage"
    >
      <v-layer ref="layer">
        <v-rect :config="{
          x: 0,
          y: 0,
          width: 500,
          height: 500,
          opacity: 0.1,
          fill: 'gray',
          perfectDrawEnabled:false
        }"
        />
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