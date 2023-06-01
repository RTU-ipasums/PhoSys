<script>
export default {
    props: ['config'],
    methods: {
    updateCircle() {
        const circle = this.$refs.circle.getNode();
        this.config.x=circle.x();
        this.config.y=circle.y();
        this.config.radius=circle.radius();
        this.config.scaleX=circle.scaleX();
        this.config.scaleY=circle.scaleY();
        this.config.rotation=circle.rotation();
    },
  },
};
</script>
<template>
<v-circle :config="{
    name:config.name,
    x:config.x,
    y:config.y,
    radius:config.radius,
    scaleX:config.scaleX,
    scaleY:config.scaleY,
    fill: 'blue',
    opacity: 0.5,
    draggable:true,
    perfectDrawEnabled: false,
}"
@dragmove="updateCircle" 
@transformend="updateCircle"
ref="circle"/>
</template>