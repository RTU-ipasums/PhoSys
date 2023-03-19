import { computed, ref } from 'vue'
import { reactive } from 'vue'
import { data } from './data.js'
import io from 'socket.io-client';
import * as d3 from "d3";
import * as mpld3 from 'mpld3';

export let socket = ref(io());
let frameIdx = 0;
let imgObj = null;
let framesC = [null];
let framecount = 1;

export const frames = reactive({
  frameNum: 1,
  playing: false,
  loop: false,
  generating: false,
  fps: 30,
  genActive: false,// used for showing loading spinner
  get genActive() {
    return framecount > framesC.length || this.generating;
  },
  get maxFrame() {
    return Math.max(framecount, framesC.length)//Math.max(framesC.length, data.properties.find(item => item.propertyName === "Framecount").value);
  },
  set maxFrame(val) {
    if (framesC.length < val) {// requests aditional frames if out of bounds
      this.frameNum = framesC.length;
      framecount = val;
      socket.value.emit('generate_frames', val - framesC.length);
    }
  },
  set frameNum(val) {// sets active frame
    if (framesC[0] != null) {
      frameIdx = val - 1;
      if (framesC.length >= val) {
        imgObj.props.data = framesC[frameIdx];

        imgObj.image._groups[0][0].setAttribute("href", "data:image/png;base64," + imgObj.props.data);
      }
      else if (framesC.length < val) {// too big
        this.frameNum = framesC.length;
      }
      else if (val < 1) {// too small
        this.frameNum = 1;
      }
      else {
        console.warn("Error setting frame!")
        imgObj.props.data = "iVBORw0KGgoAAAANSUhEUgAAAIAAAABgCAMAAADipIp7AAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAAYUExURUIyJCYUFMGNOnpwUINkMrOndMfFpV4iGkvLQHUAAALVSURBVGgF7ZjtchoxDEVp2ibv/8bZ4+WQi7HZbYYNdEb6gT4syZp7ZUh7+n2WP2c5DeTXWTj6OxHa0GJQPgyRS82JD4QAMsquAf4rBGY09tSSB/UP34Ea4FsI9EUuHRru9CdfAS3c+AyirY3QjXnZgRrgqQhwOZIEybk86kP22yKjXYBPxD7W6o90y1+vrwGejID8yPVMP3oH2u7lAs4uNl4DHIIA/Avxlh69/4y5S3v1hf6tiz3Py0b23ovNqwEeigCw0hAR4t1ajrf0iHdjNcChCNAcetoPfvzm67ff9SVn3YD1k5rdssU9jWqAwxCAPymQM321cXJ5dvjYiudq6rQ3NU36i/TVNiG3BjgEASEeaf4doEgBQyD41OT772kb9byK2eQqGI6Xo2uAH0UgoU8bvtcNuN4BhuMsdwAfNtFIMNvMFqOwP8DPS9OmqAY4FAEgTsjT5kzJIaARkX9z0NDZ+8SQdk7h6q6fBPPStLNRDfB0BKCDIZIWqSQ2o84cNHntD4s+mMVpU5BSAzwEgYRUKhL2tPtc3z1PGclc7MzX9g40seGXRN9I3yatcGlQA7wMAlLU66RM2nIHmp1JHvaN9PtcEfC815lfA+xGgMQeSn3OFOFHe57avNRSzHeG9s33AAXZKO1sVgMcigD8JPTYcubF0KHd56aftGHDf8pwB2qAH0fgY5HkigHwHQRb3oghxP51B6yjFqFna1QDvBQCjeAzx9i86ZWxrz2AO2Opff8Zw7YnGp965WYHTLawBngaAvKplhq5Sw1dvZhvPP2sne6AF6ttkMXaXpLafGPpW4euARoCwoROqIxDg/GED/t9EfO2ND3IyR41wOsgID9wJN/YPkN0cgf3SuZQo5jf+8bRFwRqgJdBQH6SV20491z+1fyHFXKPb2vV5N/sgIdemroGOASBhPieLdf3NJxmD+ic5XPWdiAL7tmzRhmvAb6DwCcsm2vBUraACAAAAABJRU5ErkJggg==";
        imgObj.image._groups[0][0].setAttribute("href", "data:image/png;base64," + imgObj.props.data);
      }
    }
  },
  get frameNum() {
    return frameIdx + 1;
  },
  nextFrame: function () {
    if (frameIdx + 1 < framesC.length) {
      this.frameNum = frameIdx + 2;
    }
    else {
      clearInterval(this.advanceInterval)
      this.playing = this.genActive;
    }
  },
  previousFrame: function () {
    this.frameNum = frameIdx;
  },
  firstFrame: function () {
    this.frameNum = 1;
  },
  lastFrame: function () {
    this.frameNum = framesC.length;
  },
  startStop: function () {
    this.generating = false;
    this.playing = !this.playing;
    if (this.playing) {
      if (frameIdx + 1 == framesC.length) {
        console.log('Generating!!')
        this.generating = true;
        socket.value.emit('generate_frames', 1);
      }
      else {
        this.advanceInterval = setInterval(this.nextFrame.bind(this), 1000 / this.fps);
      }
    }
    else { clearInterval(this.advanceInterval); }
  }
}
)

export function resetResult() {
  framesC = [null];
  frameIdx = 0;
}
export function pushFrame(frame) {// adds new frame to the buffer
  framesC.push(frame);
  if (framecount == framesC.length) {
    frames.generating = false;
    frames.playing = false;
    if (frameIdx == framesC.length - 2) {
      frames.frameNum = 1
    }
    else {
      frames.frameNum++;
      frames.frameNum--;
    }
  }
  else if ((framesC.length - 2 == frameIdx)) {
    if (frames.playing) {
      frames.frameNum = frameIdx + 2;
    }
  }
}

mpld3.register_plugin("animview", AnimViewPlugin);// chooses object to be animated
AnimViewPlugin.prototype = Object.create(mpld3.Plugin.prototype);
AnimViewPlugin.prototype.constructor = AnimViewPlugin;
AnimViewPlugin.prototype.requiredProps = ["idimg"];
AnimViewPlugin.prototype.defaultProps = {}
function AnimViewPlugin(fig, props) {
  mpld3.Plugin.call(this, fig, props);
};

AnimViewPlugin.prototype.draw = function () {
  let imgobjT = mpld3.get_element(this.props.idimg, this.fig);
  console.log(imgobjT);
  imgObj = imgobjT;
  framesC[0] = imgobjT.props.data;
};

export function getFigure() {// request initial canvas from backend
  console.log(JSON.parse(JSON.stringify(data)));
  framecount = data.properties.find(item => item.propertyName === "Framecount").value;
  socket.value.close();
  socket = ref(io(import.meta.env.VITE_BACKEND_URL));

  socket.value.on("connect", () => {
    socket.value.emit("sim_data", data)
    resetResult();
    frames.playing = true;
  });
  socket.value.on("canvas", (drawObj) => {
    console.log(drawObj);
    document.getElementById("fig_main").innerHTML = "";
    mpld3.draw_figure("fig_main", drawObj);
    let svg = document.querySelector(".mpld3-figure");
    svg.setAttribute("viewBox", "41 40 400 400");
    svg.setAttribute("preserveAspectRatio", "xMinYMin slice");
  });
  socket.value.on("frame", (imgdata) => {
    console.log("Got frame!!");
    pushFrame(imgdata);
    if (frames.generating) { socket.value.emit('generate_frames', 1); }
  });

}