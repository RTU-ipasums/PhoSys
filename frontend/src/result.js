import { ref } from 'vue'
import { reactive } from 'vue'
import { data } from './data.js'
import io from 'socket.io-client';
import * as d3 from "d3";
import * as mpld3 from 'mpld3';

export var socket = ref(io());
var frameIdx = 0;
var imgObj = null;
var framesC = [null];

export const frames = reactive( {
    frameNum: 1,
    set frameNum(val) {
        if (framesC[0] != null) {
            frameIdx = val-1;
            if (framesC.length >= val) {
              imgObj.props.data = framesC[frameIdx];
              
              imgObj.image._groups[0][0].setAttribute("href", "data:image/png;base64," + imgObj.props.data);
            }
            else if (framesC.length < val) {
                this.frameNum = framesC.length;
              socket.value.emit('generate_frames', val-framesC.length );
            }
            else {
              console.warn("Error setting frame!")
              imgObj.props.data = "iVBORw0KGgoAAAANSUhEUgAAAIAAAABgCAMAAADipIp7AAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAAYUExURUIyJCYUFMGNOnpwUINkMrOndMfFpV4iGkvLQHUAAALVSURBVGgF7ZjtchoxDEVp2ibv/8bZ4+WQi7HZbYYNdEb6gT4syZp7ZUh7+n2WP2c5DeTXWTj6OxHa0GJQPgyRS82JD4QAMsquAf4rBGY09tSSB/UP34Ea4FsI9EUuHRru9CdfAS3c+AyirY3QjXnZgRrgqQhwOZIEybk86kP22yKjXYBPxD7W6o90y1+vrwGejID8yPVMP3oH2u7lAs4uNl4DHIIA/Avxlh69/4y5S3v1hf6tiz3Py0b23ovNqwEeigCw0hAR4t1ajrf0iHdjNcChCNAcetoPfvzm67ff9SVn3YD1k5rdssU9jWqAwxCAPymQM321cXJ5dvjYiudq6rQ3NU36i/TVNiG3BjgEASEeaf4doEgBQyD41OT772kb9byK2eQqGI6Xo2uAH0UgoU8bvtcNuN4BhuMsdwAfNtFIMNvMFqOwP8DPS9OmqAY4FAEgTsjT5kzJIaARkX9z0NDZ+8SQdk7h6q6fBPPStLNRDfB0BKCDIZIWqSQ2o84cNHntD4s+mMVpU5BSAzwEgYRUKhL2tPtc3z1PGclc7MzX9g40seGXRN9I3yatcGlQA7wMAlLU66RM2nIHmp1JHvaN9PtcEfC815lfA+xGgMQeSn3OFOFHe57avNRSzHeG9s33AAXZKO1sVgMcigD8JPTYcubF0KHd56aftGHDf8pwB2qAH0fgY5HkigHwHQRb3oghxP51B6yjFqFna1QDvBQCjeAzx9i86ZWxrz2AO2Opff8Zw7YnGp965WYHTLawBngaAvKplhq5Sw1dvZhvPP2sne6AF6ttkMXaXpLafGPpW4euARoCwoROqIxDg/GED/t9EfO2ND3IyR41wOsgID9wJN/YPkN0cgf3SuZQo5jf+8bRFwRqgJdBQH6SV20491z+1fyHFXKPb2vV5N/sgIdemroGOASBhPieLdf3NJxmD+ic5XPWdiAL7tmzRhmvAb6DwCcsm2vBUraACAAAAABJRU5ErkJggg==";
              imgObj.image._groups[0][0].setAttribute("href", "data:image/png;base64," + imgObj.props.data);
            }
          }
        },
    get frameNum() {
        return frameIdx+1;
    }
} 
)

export function resetResult() {
    framesC = [null];
    frameIdx = 0;
}
export function pushFrame(frame) {
    framesC.push(frame);
    if (framesC.length-2 == frameIdx) {
        frames.frameNum = frameIdx+2;
    }
}

mpld3.register_plugin("animview", AnimViewPlugin);
AnimViewPlugin.prototype = Object.create(mpld3.Plugin.prototype);
AnimViewPlugin.prototype.constructor = AnimViewPlugin;
AnimViewPlugin.prototype.requiredProps = ["idimg"];
AnimViewPlugin.prototype.defaultProps = {}
function AnimViewPlugin(fig, props){
    mpld3.Plugin.call(this, fig, props);
};

AnimViewPlugin.prototype.draw = function(){
  var imgobjT = mpld3.get_element(this.props.idimg, this.fig);
  console.log(imgobjT);
  imgObj = imgobjT;
  framesC[0] = imgobjT.props.data;
};

export function getFigure() {
    console.log(JSON.stringify(data));
    socket.value.close();
    socket = ref(io(import.meta.env.VITE_BACKEND_URL));
  
    socket.value.on("connect", () => {
      socket.value.emit("sim_data", data)
      resetResult();
    });
    socket.value.on("canvas", (drawObj) => {
      console.log(drawObj);
      document.getElementById("canvas").innerHTML = "";
      mpld3.draw_figure("canvas", drawObj);
    });
    socket.value.on("frame", (imgdata) => {
      console.log("Got frame!!");
      pushFrame(imgdata);
    });
  
  }