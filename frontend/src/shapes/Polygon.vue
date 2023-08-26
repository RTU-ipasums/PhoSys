<script>
export default {
    props: ['config'],
    methods: {
        updatePolygon() {
            const polygon = this.$refs.polygon.getNode();
            this.config.x=polygon.x();
            this.config.y=polygon.y();
            this.config.scaleX=polygon.scaleX();
            this.config.scaleY=polygon.scaleY();
            this.config.rotation=polygon.rotation();
        },
        updatePolygonPoints(e) {
            const polygon = this.$refs.polygon.getNode();
            const index=e.target.attrs.pointId*2;
            let newPoints=polygon.points();
            const pos=e.target.position();
            newPoints[index]=pos.x-this.config.x;
            newPoints[index+1]=pos.y-this.config.y;
            polygon.points(newPoints);
        },
        handleStrokeClick(e){
            const stage = e.target.getStage();
            const clickPos = stage.getRelativePointerPosition();
            clickPos.x-=this.config.x;
            clickPos.y-=this.config.y;

            const polygon = this.$refs.polygon.getNode();
            let newPoints=polygon.points();
            
            let min=Number.MAX_VALUE;
            let bestIndex=-1;
            //we need to figure out between which two points the new point needs to be inserted
            for (let i=0; i < newPoints.length / 2; i++) {
                const ax = clickPos.x-newPoints[i * 2];
                const ay = clickPos.y-newPoints[i * 2 + 1];
                const bx = newPoints[(i * 2 + 2) % newPoints.length]-clickPos.x;
                const by = newPoints[(i * 2 + 3) % newPoints.length]-clickPos.y;
                
                const cross = Math.abs(ax*by-ay*bx);
             
                if(cross<min&&(ax*bx+ay*by)>0){
                    min=cross;
                    bestIndex=i;
                }
            }
            if(bestIndex===-1)return;
            newPoints.splice(2*(bestIndex+1),0,clickPos.x,clickPos.y)
            polygon.points(newPoints);
        },
        getStageScale(){
            if(!this.$refs.polygon)return {x:1,y:1};
            return {x:1/this.$refs.polygon.getNode().getStage().scaleX(),y:1/this.$refs.polygon.getNode().getStage().scaleY()}
        }
    },
    computed:{
        circlePoints(){
            let points = [];
            for(let i=0;i<this.config.points.length;i+=2){
                points.push({
                    x: this.config.points[i],
                    y: this.config.points[i+1]
                })
            }
            return points;
        },
    },
};
</script>
<template>
<v-line :config="{
    name:config.name,
    x:config.x,
    y:config.y,
    scaleX:config.scaleX,
    scaleY:config.scaleY,
    rotation:config.rotation,
    points:config.points,
    fill: 'red',
    opacity:0.3,
    perfectDrawEnabled: false,
    draggable:true,
    closed:true
}"
@dragmove="updatePolygon" 
@transformend="updatePolygon"
ref="polygon"/>
<v-line :config="{
    name:config.name,
    x:config.x,
    y:config.y,
    scaleX:config.scaleX,
    scaleY:config.scaleY,
    rotation:config.rotation,
    points:config.points,
    fill: 'red',
    opacity:1,
    perfectDrawEnabled: false,
    closed:true,
    fillEnabled:false,
    hitStrokeWidth:7,
    stroke:'rgb(0, 161, 255)',
    strokeWidth:1,
    strokeScaleEnabled:false
}"
@click="handleStrokeClick"/>

<v-rect  v-for="(point, index) in circlePoints" :key="index" :config="{
    x:point.x+config.x,
    y:point.y+config.y,
    stroke: 'rgb(0, 161, 255)',
    fill: 'white',
    width: 10,
    height: 10,
    offsetX: 5,
    offsetY: 5,
    strokeWidth: 1,
    draggable:true,
    pointId:index,
    id:'static',
    scale:getStageScale()
}"
@dragmove="updatePolygonPoints"/>
</template>