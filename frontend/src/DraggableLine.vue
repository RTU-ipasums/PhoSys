<script>
export default {
    data(){
        return{

        };
    },
    props: ['config'],
    methods: {
    updateLine() {
        console.log("updateLine");
        const point1pos = this.$refs.point1obj.getNode().getPosition();
        const point2pos = this.$refs.point2obj.getNode().getPosition();  
        const line = this.$refs.lineobj.getNode();
        line.setPoints([point1pos, point1pos, point2pos, point2pos]);
        this.config.x1=point1pos.x;
        this.config.y1=point1pos.y;
        this.config.x2=point2pos.x;
        this.config.y2=point2pos.y;
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
                points: [config.x1,config.y1, config.x2, config.y2],
                strokeWidth: 5,
                opacity: 0.5,
                stroke: 'blue',
                name:config.name
            }"
    ref="lineobj"/>
    <v-circle :config="{
                rotation: 0,
                x: config.x1,
                y: config.y1,
                radius: 10,
                scaleX: 1,
                scaleY: 1,
                fill: 'gray',
                opacity: 0.5,
                perfectDrawEnabled: false,
                draggable: true,
                name:config.name
            }"
     ref="point1obj" @dragmove="updateLine"/>
    <v-circle :config="{
                rotation: 0,
                x: config.x2,
                y: config.y2,
                radius: 10,
                scaleX: 1,
                scaleY: 1,
                fill: 'gray',
                opacity: 0.5,
                perfectDrawEnabled: false,
                draggable: true,
                name:config.name
            }"
     ref="point2obj" @dragmove="updateLine"/>
</v-group>
</template>