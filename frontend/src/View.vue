<script>
import { uuid } from 'vue-uuid'; 
import { data } from './data.js'
import * as mpld3 from "mpld3";

export default {
  props: {
    view: "a",
    currentFrame: 1,
  },
  data() {
    return {
        uuid: 'a'+uuid.v4(),
        mpld: null,
    }
  },
  watch: {
    view: function(newVal, oldVal) {
        //console.warn(data.data);
        var prevEl = document.getElementById(this.uuid);
        if (prevEl != null) {
            prevEl.innerHTML = ""
            mpld3.remove_figure(this.uuid);
        }
        
        this.dView = data.views[newVal];

        console.warn(this.dView);
        console.log(this.uuid);
        this.mpld = new mpld3.Figure(this.uuid, this.dView.canvas);
        mpld3.figures.push(this.mpld);
        this.mpld.draw();
        console.warn(this.mpld);

        this.dView.mpld = this.mpld;
        if (this.dView.type == "detector") {
            this.dView.data[0] = this.mpld.axes[0].elements[2].props.data;
            this.mpld.axes[0].elements[2].props.data = this.dView.activeFrame;
        }
        else if (this.dView.type == "view") {
            this.dView.data[0] = this.mpld.props.data;
            this.mpld.props.data = this.dView.activeFrame;
        }


        /*let svg = document.querySelectorAll(".mpld3-figure")[1];
        svg.setAttribute("viewBox", "0 0 640 480");
        svg.setAttribute("preserveAspectRatio", "xMinYMin meet");
        svg = document.querySelectorAll(".mpld3-figure")[0];
        svg.setAttribute("viewBox", "41 40 400 400");
        svg.setAttribute("preserveAspectRatio", "xMinYMin slice");*/
    },
    /*currentFrame: function(newVal, oldVal) {
        console.log(newVal);
        this.mpld.props.data = this.dView.activeFrame;
    },*/
    //data[currentFrame]: function(newVal, oldVal) {}
  }
};


</script>

<template>
    <div :id=this.uuid ref="canvas"></div>
</template>