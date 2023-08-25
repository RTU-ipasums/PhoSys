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
  },
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
    opacity:1.0,
    perfectDrawEnabled: false,
    draggable:true,
    closed:true
}"
@dragmove="updatePolygon" 
@transformend="updatePolygon"
ref="polygon"/>
</template>