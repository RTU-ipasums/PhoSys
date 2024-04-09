<script>
import { uuid } from 'vue-uuid'; 
import { data, internal } from './data.js'
import * as mpld3 from "mpld3";
import { toRaw } from 'vue'

export default {
  props: {
    view: ""
  },
  data() {
    return {
        uuid: 'uuid'+uuid.v4(),
        mpld: null,
        internal,
    }
  },
  computed:{
    frameCount(){
      return this.internal?.views[this.view]?.data?.length;
    }
  },
  methods:{
    updateView(){
      var prevEl = document.getElementById(this.uuid);
      if (prevEl != null) {
          prevEl.innerHTML = ""
          mpld3.remove_figure(this.uuid);
      }
      if(!this.view)return;
      
      this.mpld = new mpld3.Figure(this.uuid, internal.views[this.view].canvas);
      mpld3.figures.push(this.mpld);
      this.mpld.draw();
      let svgEl=prevEl.firstChild.firstChild;
      if (internal.views[this.view].type == "detector") {
          this.mpld.axes[0].elements[2].props.data = internal.views[this.view].activeFrame;
      }
      else if (internal.views[this.view].type == "view") {
          this.mpld.props.data = internal.views[this.view].activeFrame;
          svgEl.setAttribute("viewBox", "41 40 400 400");
          svgEl.setAttribute("preserveAspectRatio", "xMinYMin slice");
      }
    
      this.setFrame();
    },
    setFrame() {
        if(!this.mpld) return;
        if(!internal.views[this.view])return;
        
        if (internal.views[this.view].type == "detector") {
          this.mpld.axes[0].elements[2].data = internal.views[this.view].data[internal.currentFrame-1];
          toRaw(this.mpld.axes[0].elements[2].path._groups)[0][0].remove();// clear last path
          this.mpld.axes[0].elements[2].draw();
        }       
        else if (internal.views[this.view].type == "view") {
          this.mpld.axes[0].elements[2].image._groups[0][0].setAttribute("href", "data:image/png;base64," + internal.views[this.view].data[internal.currentFrame-1]);
        }
    }
  },
  watch: {
    view() {
      this.updateView();
    },
    'internal.currentFrame': function (newVal, oldVal) {
        this.setFrame();
    },
    frameCount() {
      if(this.frameCount==1)this.updateView();
      
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