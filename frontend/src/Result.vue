<script>
import io from "socket.io-client";
import * as d3 from "d3";
import * as mpld3 from "mpld3";
import "./interactive-legend";
import { data } from './data.js'

export default {
  data() {
    return {
      data,//todo: do we need this here?
      socket: io(),
      frameIdx: 1,
      imgObj: null,
      framesC: [null],
      framecount: 1,
      playing: false,
      loop: false,
      generating: false,
      fps: 30,
      advanceInterval: null,
    };
  },
  computed: {
    maxFrame() {
      return Math.max(this.framecount, this.framesC.length);
    },
    genActive() {
      return this.framecount > this.framesC.length || this.generating;
    },
  },
  methods: {
    setMaxFrame(val) {
      if (this.framesC.length < val) {
        this.framecount = val;
        this.socket.emit('generate_frames', val - this.framesC.length);
      }
    },
    setFrameNum(val) {
      if (this.framesC[0] != null) {
        this.frameIdx = val;
        if (this.framesC.length >= val) {
          this.imgObj.props.data = this.framesC[this.frameIdx-1];
          this.imgObj.image._groups[0][0].setAttribute("href", "data:image/png;base64," + this.imgObj.props.data);
        }
      }
    },
    nextFrame() {
      if (this.frameIdx < this.framesC.length) {
        this.setFrameNum(this.frameIdx + 1);
      }
      else {
        clearInterval(this.advanceInterval)
        this.playing = this.genActive;
      }
    },
    previousFrame() {
      this.setFrameNum(this.frameIdx-1);
    },
    firstFrame() {
      this.setFrameNum(1);
    },
    lastFrame() {
      this.setFrameNum(this.framesC.length);
    },
    startStop() {
      this.generating = false;
      this.playing = !this.playing;
      if (this.playing) {
        if (this.frameIdx == this.framesC.length) {
          console.log('Generating!!')
          this.generating = true;
          this.socket.emit('generate_frames', 1);
        }
        else {
          this.advanceInterval = setInterval(this.nextFrame.bind(this), 1000 / this.fps);
        }
      }
      else { clearInterval(this.advanceInterval); }
    },
    resetResult() {
      this.framesC = [];
      this.frameIdx = 1;
    },
    pushFrame(frame) {
      this.framesC.push(frame);
      if (this.framecount == this.framesC.length) {
        this.generating = false;
        this.playing = false;
        //todo: fix this
        if (this.frameIdx == this.framesC.length - 1) {
          this.setFrameNum(1);
        }
        else {
          this.setFrameNum(this.frameIdx + 2);
          this.setFrameNum(this.frameIdx);
        }
      }
      else if ((this.framesC.length - 1 == this.frameIdx)) {
        if (this.playing) {
          this.setFrameNum(this.frameIdx + 1);
        }
      }
    },
    
    getFigure() {
      console.log(JSON.parse(JSON.stringify(data)));
      this.framecount = data.frameCount;
      this.socket.close();
      this.socket = io(import.meta.env.VITE_BACKEND_URL);

      this.socket.on("connect", () => {
        this.socket.emit("sim_data", data)
        this.resetResult();
        this.playing = true;
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
        this.pushFrame(imgdata);
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
      componentThis.framesC[0] = imgobjT.props.data;
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
