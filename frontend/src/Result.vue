<script>
import io from "socket.io-client";
import * as mpld3 from "mpld3";
import "./interactive-legend";
import { data } from './data.js'
import { toRaw } from 'vue'

export default {
  data() {
    return {
      socket: io(),
      currentFrame: 1,
      imgObj: null,
      frameData: [],
      isPlaying: false,
      generating: false,
      fps: 30,
      advanceInterval: null,
    };
  },
  computed: {
    maxFrame() {
      return Math.max(data.frameCount, this.frameData.length);
    },
    isGenerating() {
      return this.generating===true||(this.frameData.length<data.frameCount&&this.frameData.length>0);
    },
  },
  methods: {
    setFrame(val) {
      if (this.frameData[0] != null) {
        this.currentFrame = val;
        if (this.frameData.length >= val) {
          this.imgObj.props.data = this.frameData[this.currentFrame-1];
          this.imgObj.image._groups[0][0].setAttribute("href", "data:image/png;base64," + this.imgObj.props.data);
        }
      }
    },
    setNextFrame() {
      if (this.currentFrame < this.frameData.length) {
        this.setFrame(this.currentFrame + 1);
      }
      else {
        clearInterval(this.advanceInterval)
        this.isPlaying = this.isGenerating;
      }
    },
    setPreviousFrame() {
      this.setFrame(this.currentFrame-1);
    },
    setFirstFrame() {
      this.setFrame(1);
    },
    setLastFrame() {
      this.setFrame(this.frameData.length);
    },
    togglePlay() {
      this.generating = false;
      this.isPlaying = !this.isPlaying;
      if(!this.frameData)return;
      if (this.isPlaying) {
        if (this.currentFrame == this.frameData.length) {
          this.generating = true;
          this.socket.emit('generate_frames', 1);
        }
        else {
          this.advanceInterval = setInterval(this.setNextFrame.bind(this), 1000 / this.fps);
        }
      }
      else { clearInterval(this.advanceInterval); }
    },
    reset() {
      this.frameData = [];
      this.currentFrame = 1;
    },
    addFrame(frame) {
      this.frameData.push(frame);
     
      if (data.frameCount == this.frameData.length) {
        this.generating = false;
        this.isPlaying = false;

        this.setFrame(this.currentFrame + 1);
        this.setFrame(this.currentFrame);
        
      }
      else if ((this.frameData.length - 1 == this.currentFrame)&&this.isPlaying) {
        this.setFrame(this.currentFrame + 1);
      }
    },
    
    startGeneration() {
      console.log(structuredClone(toRaw(data)));
      data.frameCount = data.frameCount;
      this.socket.close();
      this.socket = io(import.meta.env.VITE_BACKEND_URL);

      this.socket.on("connect", () => {
        this.socket.emit("sim_data", data)
        this.reset();
        this.isPlaying = true;
      });
      this.socket.on("canvas", (drawObj) => {
        console.log(drawObj);
        document.getElementById("fig_main").innerHTML = "";
        mpld3.draw_figure("fig_main", drawObj);
        let svg = document.querySelector(".mpld3-figure");
        svg.setAttribute("viewBox", "41 40 400 400");
        svg.setAttribute("preserveAspectRatio", "xMinYMin slice");
      });
      this.socket.on("frame", (imgdata) => {
        console.log("Got frame!!");
        this.addFrame(imgdata);
        if (this.generating) { this.socket.emit('generate_frames', 1); }
      });
    },
  },
  mounted() {
    mpld3.register_plugin("animview", AnimViewPlugin);
    AnimViewPlugin.prototype = Object.create(mpld3.Plugin.prototype);
    AnimViewPlugin.prototype.constructor = AnimViewPlugin;
    AnimViewPlugin.prototype.requiredProps = ["idimg"];
    AnimViewPlugin.prototype.defaultProps = {}
    function AnimViewPlugin(fig, props) {
      mpld3.Plugin.call(this, fig, props);
    };
    let componentThis=this;
    AnimViewPlugin.prototype.draw = function() {
      let imgobjT = mpld3.get_element(this.props.idimg, this.fig);
      console.log(imgobjT);
      componentThis.imgObj = imgobjT;
      componentThis.frameData[0] = imgobjT.props.data;
    };
  }
}
</script>

<template>
  <div id="fig_main"></div>
</template>

<style>
.mpld3-figure {
  flex: 1;
  height: 100%;
}

#fig_main {
  min-height: 0;
  height: 100%;
}

#fig_main>* {
  height: 100%;
  display: flex;
}
</style>
