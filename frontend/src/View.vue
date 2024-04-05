<script>
import { uuid } from 'vue-uuid'; 
import { data } from './data.js'
import * as mpld3 from "mpld3";
import { toRaw } from 'vue'

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
      console.log(this.uuid)
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

      this.dView.panes.push(this);
      if (this.dView.type == "detector") {
          this.mpld.axes[0].elements[2].props.data = this.dView.activeFrame;
      }
      else if (this.dView.type == "view") {
          this.mpld.props.data = this.dView.activeFrame;
      }
      this.setFrame();
    },
    setFrame() {
        if(!this.mpld) return;
        this.activeFrame = this.dView.data[this.currentFrame-1];

        if (this.dView.type == "detector") {
          this.mpld.axes[0].elements[2].data = this.activeFrame;
          toRaw(this.mpld.axes[0].elements[2].path._groups)[0][0].remove();// clear last path
          this.mpld.axes[0].elements[2].draw();
        }       
        else if (this.dView.type == "view") {
          this.mpld.axes[0].elements[2].image._groups[0][0].setAttribute("href", "data:image/png;base64," + this.activeFrame);
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