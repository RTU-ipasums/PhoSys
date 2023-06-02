<script>
export default {
    props: ['config'],
    methods: {
    updateRect() {
        const rectangle = this.$refs.rectangle.getNode();
        this.config.x=rectangle.x();
        this.config.y=rectangle.y();
        this.config.width=rectangle.width();
        this.config.height=rectangle.height();
        this.config.scaleX=rectangle.scaleX();
        this.config.scaleY=rectangle.scaleY();
        this.config.rotation=rectangle.rotation();

    },
  },
};
</script>
<template>
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
    opacity:0.3,
    perfectDrawEnabled: false,
    draggable:true
}"
@dragmove="updateRect" 
@transformend="updateRect"
ref="rectangle"/>
</template>