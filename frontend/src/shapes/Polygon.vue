<script>
export default {
    props: ['config'],
    methods: {
    updatePolygon() {
        const polygon = this.$refs.polygon.getNode();
        this.config.x=polygon.x();
        this.config.y=polygon.y();
        this.config.width=polygon.width();
        this.config.height=polygon.height();
        this.config.scaleX=polygon.scaleX();
        this.config.scaleY=polygon.scaleY();
        this.config.rotation=polygon.rotation();

    },
  },
};
</script>
<template>
<!-- replace rect with polygon -->
<v-rect :config="{
    name:config.name,
    x:config.x,
    y:config.y,
    width:config.width,
    height:config.height,
    scaleX:config.scaleX,
    scaleY:config.scaleY,
    rotation:config.rotation,
    fill: 'red',
    opacity:1.0,
    perfectDrawEnabled: false,
    draggable:true
}"
@dragmove="updatePolygon" 
@transformend="updatePolygon"
ref="polygon"/>
</template>