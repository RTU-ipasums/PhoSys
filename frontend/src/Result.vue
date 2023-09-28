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
      figMain: null,
      figDetector: null,
      imgObj: null,
      graphObj: null,
      frameData: [],
      detectorData: [],
      selectedDetector: 0,// TODO: dropdown to select the detector
      isPlaying: false,
      generating: false,
      fps: 30,
      advanceInterval: null,
      panes:[
        {
          type:"horizontal",
          panes:['fig_main','fig_detector']
        }
      ]
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

          if (this.graphObj!=null) {
            this.graphObj.data = this.detectorData[this.currentFrame-1][this.selectedDetector];
            toRaw(this.graphObj.path._groups)[0][0].remove();// clear last path
            this.graphObj.draw();
          }
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
      this.detectorData = [];
      this.currentFrame = 1;
    },
    addFrame(frame, detectorData) {
      this.frameData.push(frame);
      if (detectorData.length) {
        this.detectorData.push(detectorData);
      }

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
      console.log(JSON.parse(JSON.stringify(data)));
      data.frameCount = data.frameCount;
      this.socket.close();
      this.socket = io(import.meta.env.VITE_BACKEND_URL);

      this.socket.on("connect", () => {
        this.socket.emit("sim_data", data)
        this.reset();
        this.isPlaying = true;
      });
      this.socket.on("canvas", (inData) => {
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
        svg.setAttribute("preserveAspectRatio", "xMinYMin slice");
      });
      this.socket.on("frame", frameData => {
        console.log("Got frame!!");
        this.addFrame(frameData.visual, frameData.graph);
        if (this.generating) { this.socket.emit('generate_frames', 1); }
      });
    },
  },
  mounted() {
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
  }
}
</script>

<template>
  <ul class="layouts">
    <li><button><img src="/1-view.svg" alt="1 view layout"/></button></li>
    <li><button><img src="/2-views.svg" alt="2 view layout"/></button></li>
    <li><button><img src="/2-views.svg" alt="2 view layout horizontal" style="transform:rotate(90deg);"/></button></li>
    <li><button><img src="/3-views.svg" alt="3 view layout"/></button></li>
    <li><button><img src="/3-views.svg" alt="3 view layout horizontal" style="transform:rotate(90deg);"/></button></li>
    <li><button><img src="/3-views-split.svg" alt="3 view layout split"/></button></li>
    <li><button><img src="/3-views-split.svg" alt="3 view layout split horizontal" style="transform:rotate(90deg);"/></button></li>
    <li><button><img src="/4-views.svg" alt="4 view layout"/></button></li>
  </ul>
  <splitpanes v-for="mainpane in panes" id="splitpanes" :horizontal="mainpane.type=='horizontal'" first-splitter>
    <pane v-for="pane in mainpane.panes"><ResultView :container_id="pane"/></pane>
  </splitpanes>
</template>

<style scoped>
.layouts{
  display:flex;
  padding: 5px 5px;
  height:30px;
  gap:5px;
}
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
