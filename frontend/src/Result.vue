<script>
import ResultPane from './ResultPane.vue'
import io from "socket.io-client";
import * as mpld3 from "mpld3";
import "./interactive-legend";
import { data, internal } from './data.js'
import { Splitpanes, Pane } from 'splitpanes'

export default {
  components: {
      ResultPane,
      Splitpanes,
      Pane
  },
  data() {
    return {
      socket: io(import.meta.env.VITE_BACKEND_URL),
      isPlaying: false,
      generating: false,
      fps: 30,
      advanceInterval: null,
      internal,
      selectedViews: {
        //"View name": numberOfOpenPanes
      }
    };
  },
  computed: {
    loadedFrameCount() {
      //Number of frames in recieved data
      let len = Object.values(internal.views)[0]?.data?.length;
      return (len)?len:0;
    },
    maxFrame() {
      //The maximum frame displayed on seekbar
      return Math.max(data.frameCount, this.loadedFrameCount);
    },
    isGenerating() {
      return this.generating===true||(this.loadedFrameCount<data.frameCount&&this.loadedFrameCount>0);
    },
    getData() {
      return data ? internal.views : null;
    }
  },
  methods: {
    setFrame(val) {
      if (this.loadedFrameCount<=0) return; 
      internal.currentFrame = val;
    },
    setNextFrame() {
      if (internal.currentFrame < this.loadedFrameCount) {
        this.setFrame(internal.currentFrame + 1);
      }
      else {
        clearInterval(this.advanceInterval)
        this.isPlaying = this.isGenerating;
      }
    },
    setPreviousFrame() {
      this.setFrame(internal.currentFrame-1);
    },
    setFirstFrame() {
      this.setFrame(1);
    },
    setLastFrame() {
      this.setFrame(this.loadedFrameCount);
    },
    togglePlay() {
      this.generating = false;
      this.isPlaying = !this.isPlaying;
      if(this.loadedFrameCount<=0)return;
      if (this.isPlaying) {
        if (internal.currentFrame == this.loadedFrameCount) {
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
      internal.views = {};
      internal.currentFrame = 1;
    },
    addFrame(views) {
      for (var view of Object.keys(internal.views)) {
        internal.views[view].data.push(views[view].data);
      }
      if (data.frameCount == this.loadedFrameCount) {
        this.generating = false;
        this.isPlaying = false;
        this.setFrame(internal.currentFrame + 1);
      }
      else if ((this.loadedFrameCount - 1 == internal.currentFrame) && this.isPlaying) {
        this.setFrame(internal.currentFrame + 1);
      }
    },
    
    startGeneration() {
      this.socket.close();
      this.socket = io(import.meta.env.VITE_BACKEND_URL);

      this.socket.on("connect", () => {
        this.socket.emit("sim_data", data)
        this.reset();
        this.isPlaying = true;
      });
      this.socket.on("canvas", (inData) => {
        internal.views = inData.views;
        for (var viewName in internal.views) {
          var view = internal.views[viewName]
          view.panes = []
          view.activeFrame = view.data[internal.currentFrame-1];
        }
      });
      this.socket.on("frame", frameData => {
        console.log("Got frame!!");
        this.addFrame(frameData.views);
        if (this.generating) { this.socket.emit('generate_frames', 1); }
      });
    }
  },
}
</script>

<template>
  <ResultPane :views="getData" :selectedViews="selectedViews" :horizontal="false"/>
</template>

<style scoped>
li{
  line-height: 0;
  height: 100%;
}
button{
  height: 100%;
}
img{
  height: 100%;
}
</style>
