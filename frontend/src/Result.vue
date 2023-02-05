<script setup>
import { ref } from 'vue'
import { data } from './data.js'
import { io } from 'socket.io-client';
import * as d3 from "d3";
import * as mpld3 from 'mpld3';

var frames = [];

mpld3.register_plugin("animview", AnimViewPlugin);
AnimViewPlugin.prototype = Object.create(mpld3.Plugin.prototype);
AnimViewPlugin.prototype.constructor = AnimViewPlugin;
AnimViewPlugin.prototype.requiredProps = ["idimg"];
AnimViewPlugin.prototype.defaultProps = {}
function AnimViewPlugin(fig, props){
    mpld3.Plugin.call(this, fig, props);
};

AnimViewPlugin.prototype.draw = function(){
  var imgobj = mpld3.get_element(this.props.idimg, this.fig);
  frames.push(imgobj.props.data);
  console.log(imgobj);
};

function getFigure() {
  console.log(JSON.stringify(data));
  const socket = io(import.meta.env.VITE_BACKEND_URL);

  socket.on("connect", () => {
    socket.emit("sim_data", data)
  });

  socket.on("canvas", (drawObj) => {
    console.log(drawObj);
    document.getElementById("canvas").innerHTML = "";
    mpld3.draw_figure("canvas", drawObj);
  });
  socket.on("frame", (imgdata) => {
    frames.push(imgdata);
  });

}
defineExpose({
  getFigure
});
</script>

<template>
  <div id="fig_main">

  </div>
</template>

<style scoped>
</style>
