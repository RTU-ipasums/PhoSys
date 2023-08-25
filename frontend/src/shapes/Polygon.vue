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
        }
    }
};
</script>
<template>
<!-- replace rect with polygon -->
<v-line :config="{
    name:config.name,
    x:config.x,
    y:config.y,
    scaleX:config.scaleX,
    scaleY:config.scaleY,
    rotation:config.rotation,
    points:config.points,
    fill: 'red',
    opacity:0.5,
    perfectDrawEnabled: false,
    draggable:true,
    closed:true
}"
@dragmove="updatePolygon" 
@transformend="updatePolygon"
ref="polygon"/>

<v-circle  v-for="(point, index) in circlePoints" :key="index" :config="{
    x:point.x+config.x,
    y:point.y+config.y,
    fill:'gray',
    radius:5,
    draggable:true,
    pointId:index
}"
@dragmove="updatePolygonPoints"/>
</template>