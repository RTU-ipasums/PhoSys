<script>
export default {
    props: ['config'],
    methods: {
    updateLine() {
        const point1pos = this.$refs.point1obj.getNode().getPosition();
        const point2pos = this.$refs.point2obj.getNode().getPosition();  
        const group = this.$refs.group.getNode();
        const line = this.$refs.lineobj.getNode();
        line.setPoints([point1pos.x, point1pos.y, point2pos.x, point2pos.y]);
        this.config.points[0]=point1pos.x;
        this.config.points[1]=point1pos.y;
        this.config.points[2]=point2pos.x;
        this.config.points[3]=point2pos.y;
        this.config.x=group.x();
        this.config.y=group.y();
    },
  }
};
</script>
<template>
<v-group :config="{ 
    draggable: true,
    name:config.name,
    x:config.x,
    y:config.y
}" 
@dragmove="updateLine" 
@transformend="updateLine"
ref="group">
    <v-line :config="{
        points: config.points,
        strokeWidth: 5,
        opacity: 0.5,
        stroke: 'blue',
        perfectDrawEnabled: false
    }"
    @dragmove="updateLine" 
    @transformend="updateLine"
    ref="lineobj"/>
    <v-circle :config="{
        rotation: 0,
        x: config.points[0],
        y: config.points[1],
        radius: 10,
        scaleX: 1,
        scaleY: 1,
        fill: 'gray',
        opacity: 0.5,
        perfectDrawEnabled: false,
        draggable: true,
    }" 
    @dragend="$emit('sizeupdate')"
    @dragmove="updateLine" 
    @transformend="updateLine"
    ref="point1obj"/>
    <v-circle :config="{
        rotation: 0,
        x: config.points[2],
        y: config.points[3],
        radius: 10,
        scaleX: 1,
        scaleY: 1,
        fill: 'gray',
        opacity: 0.5,
        perfectDrawEnabled: false,
        draggable: true,
    }"
    @dragend="$emit('sizeupdate')"
    @dragmove="updateLine" 
    @transformend="updateLine"
    ref="point2obj"/>
</v-group>
</template>