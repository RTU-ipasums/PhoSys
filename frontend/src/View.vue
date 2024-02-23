<script>
import { uuid } from 'vue-uuid'; 
import { data } from './data.js'
import * as mpld3 from "mpld3";

export default {
  props: {
    view: "",
    currentFrame: 1,
  },
  data() {
    return {
        uuid: 'uuid'+uuid.v4(),
        mpld: null,
    }
  },
  methods:{
    updateView(newView){
      if(newView=="")return;
      var prevEl = document.getElementById(this.uuid);
      if (prevEl != null) {
          prevEl.innerHTML = ""
          mpld3.remove_figure(this.uuid);
      }
      
      this.dView = data.views[newView];

      this.mpld = new mpld3.Figure(this.uuid, this.dView.canvas);
      mpld3.figures.push(this.mpld);
      this.mpld.draw();

      this.dView.mpld = this.mpld;
      if (this.dView.type == "detector") {
          this.dView.data[0] = this.mpld.axes[0].elements[2].props.data;
          this.mpld.axes[0].elements[2].props.data = this.dView.activeFrame;
      }
      else if (this.dView.type == "view") {
          this.dView.data[0] = this.mpld.props.data;
          this.mpld.props.data = this.dView.activeFrame;
      }
    }
  },
  watch: {
    view(newVal) {
      this.updateView(newVal);
    }
  },
  mounted() {
    this.updateView(this.view);
  }
};


</script>

<template>
    <div :id=this.uuid ref="canvas"></div>
</template>