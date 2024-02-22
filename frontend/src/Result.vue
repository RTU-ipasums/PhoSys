<script>
import ResultView from './ResultView.vue'
import io from "socket.io-client";
import * as mpld3 from "mpld3";
import "./interactive-legend";
import { data } from './data.js'
import { toRaw } from 'vue'
import { Splitpanes, Pane } from 'splitpanes'

export default {
  components: {
      ResultView,
      Splitpanes,
      Pane
  },
  data() {
    return {
      socket: io(import.meta.env.VITE_BACKEND_URL),
      currentFrame: 1,
      isPlaying: false,
      generating: false,
      fps: 30,
      advanceInterval: null
    };
  },
  computed: {
    loadedFrameCount() {
      //Number of frames in recieved data
      let len = Object.values(data.views)[0]?.data?.length;
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
      return data ? data.views : null;
    }
  },
  methods: {
    setFrame(val) {
      if (this.loadedFrameCount<=0) return; 
      this.currentFrame = val;

      for (var viewName in data.views) {
        let view = data.views[viewName];
        if(!view.mpld)continue;
        //console.log(this.currentFrame, view.data[this.currentFrame-1])
        view.activeFrame = view.data[this.currentFrame-1];
        /*var base64 = btoa(
          new Uint8Array(view.activeFrame)
            .reduce((data, byte) => data + String.fromCharCode(byte), '')
        );
        console.log(base64)*/
        
        //view.mpld.props.data = view.activeFrame;
        //view.mpld.axes[0].elements[2].props.data = view.activeFrame;
       
        if (view.type == "view") {
          view.mpld.axes[0].elements[2].image._groups[0][0].setAttribute("href", "data:image/png;base64," + view.activeFrame);
        }
        else if (view.type == "detector") {
          view.mpld.axes[0].elements[2].data = view.activeFrame;
          toRaw(view.mpld.axes[0].elements[2].path._groups)[0][0].remove();// clear last path
          view.mpld.axes[0].elements[2].draw();
        }
      }

      /*if (this.frameData.length >= val) {
        this.imgObj.props.data = this.frameData[this.currentFrame-1];
        this.imgObj.image._groups[0][0].setAttribute("href", "data:image/png;base64," + this.imgObj.props.data);

        if (this.graphObj!=null) {
          this.graphObj.data = this.detectorData[this.currentFrame-1][this.selectedDetector];
          toRaw(this.graphObj.path._groups)[0][0].remove();// clear last path
          this.graphObj.draw();
        }
      }*/
    },
    setNextFrame() {
      if (this.currentFrame < this.loadedFrameCount) {
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
      this.setFrame(this.loadedFrameCount);
    },
    togglePlay() {
      this.generating = false;
      this.isPlaying = !this.isPlaying;
      if(this.loadedFrameCount<=0)return;
      if (this.isPlaying) {
        if (this.currentFrame == this.loadedFrameCount) {
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
      data.views = [[]];
      this.currentFrame = 1;
    },
    addFrame(views) {
      for (var view of Object.keys(data.views)) {
          data.views[view].data.push(views[view].data);
      }
      
      /*if (detectorData.length) {
        this.detectorData.push(detectorData);
      }*/
      if (data.frameCount == this.loadedFrameCount) {
        this.generating = false;
        this.isPlaying = false;

        this.setFrame(this.currentFrame + 1);
        this.setFrame(this.currentFrame);
        
      }
      else if ((this.loadedFrameCount - 1 == this.currentFrame) && this.isPlaying) {
        this.setFrame(this.currentFrame + 1);
      }
    },
    
    startGeneration() {
      //console.log(JSON.parse(JSON.stringify(data)));
      data.frameCount = data.frameCount;
      this.socket.close();
      this.socket = io(import.meta.env.VITE_BACKEND_URL);

      this.socket.on("connect", () => {
        this.socket.emit("sim_data", data)
        this.reset();
        this.isPlaying = true;
      });
      this.socket.on("canvas", (inData) => {
        data.views = inData.views;
        for (var viewName in data.views) {
          var view = data.views[viewName]
          view.activeFrame = view.data[this.currentFrame-1];
        }
        
        /*for (const view in data.views) {
          view.activeFrame = view.data[this.currentFrame-1];
        }*/
        /*for (var view in this.views) {
          mpld3.remove_figure(view);
          var prevEl = document.getElementById(view);
          if (prevEl != null) {
            prevEl.innerHTML = ""
          }
          //move to component
          this.mplds[view] = new mpld3.Figure(view, this.views[view]);
          mpld3.figures.push(this.mplds[view]);
          this.mplds[view].draw();
        }
        //
        document.getElementById("fig_detector").innerHTML = "";
        if (inData.graph != null) {
          this.figDetector = mpld3.draw_figure("fig_detector", inData.graph);
        }

        document.getElementById("fig_main").innerHTML = "";
        if (this.figMain != null) {
          mpld3.remove_figure("fig_main");
        }
        this.figMain = new mpld3.Figure("fig_main", inData.res);
        mpld3.figures.push(this.figMain);
        this.figMain.draw();

        let svg = document.querySelectorAll(".mpld3-figure")[1];
        svg.setAttribute("viewBox", "0 0 640 480");
        svg.setAttribute("preserveAspectRatio", "xMinYMin meet");
        svg = document.querySelectorAll(".mpld3-figure")[0];
        svg.setAttribute("viewBox", "41 40 400 400");
        svg.setAttribute("preserveAspectRatio", "xMinYMin slice");*/
      });
      this.socket.on("frame", frameData => {
        console.log("Got frame!!");
        this.addFrame(frameData.views);
        if (this.generating) { this.socket.emit('generate_frames', 1); }
      });
    }
  },
  /*mounted() {
    mpld3.register_plugin("animview", AnimViewPlugin);
    AnimViewPlugin.prototype = Object.create(mpld3.Plugin.prototype);
    AnimViewPlugin.prototype.constructor = AnimViewPlugin;
    AnimViewPlugin.prototype.requiredProps = ["idgraph", "idimg"];
    AnimViewPlugin.prototype.defaultProps = {}
    function AnimViewPlugin(fig, props) {
      mpld3.Plugin.call(this, fig, props);
    };
    let componentThis=this;
    AnimViewPlugin.prototype.draw = function() {
      let imgobjT = mpld3.get_element(this.props.idimg, componentThis.figMain);
      componentThis.imgObj = imgobjT;
      componentThis.frameData[0] = imgobjT.props.data;

      if (componentThis.figDetector) {
        //let graphObjT = mpld3.get_element(this.props.idgraph, componentThis.figDetector);
        let graphObjT = componentThis.figDetector.axes[0].elements[2];// temp
        //console.log(graphObjT);
        componentThis.graphObj = graphObjT;
        componentThis.detectorData[0] = [graphObjT.props.data];
      }
    };
  }*/
}
</script>

<template>
  <ResultView :views="getData" :horizontal="false" :currentFrame="currentFrame"/>
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
