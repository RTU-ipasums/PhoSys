<script>
export default {
    data(){
        return{

        };
    },
    props: ['config'],
    methods: {
    updateLine() {
        const point1pos = this.$refs.point1obj.getNode().getPosition();
        const point2pos = this.$refs.point2obj.getNode().getPosition();  
        const line = this.$refs.lineobj.getNode();
        line.setPosition(point1pos);
        line.setPoints([0, 0, point2pos.x - point1pos.x, point2pos.y - point1pos.y]);
        this.config.points=[point1pos.x,point1pos.y,point2pos.x,point2pos.y];
    },
  },
};
</script>
<template>
<v-group :config="{ 
    draggable: true,
    name:config.name
}">
    <v-line :config="{
                x: config.points[0],
                y: config.points[1],
                points: [0, 0, config.points[2]-config.points[0], config.points[3]-config.points[1]],
                strokeWidth: 5,
                opacity: 0.5,
                stroke: 'blue'
            }"
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
     ref="point1obj" @dragmove="updateLine"/>
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
     ref="point2obj" @dragmove="updateLine"/>
</v-group>
</template>