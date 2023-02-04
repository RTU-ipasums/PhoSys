<script setup>
import { ref } from 'vue'
import {data} from './data.js'

function mpld3_load_lib(url, callback) {
  var s = document.createElement('script');
  s.src = url;
  s.async = true;
  s.onreadystatechange = s.onload = callback;
  s.onerror = function () {
    console.warn("failed to load library " + url);
  };
  document.getElementsByTagName("head")[0].appendChild(s);
}
mpld3_load_lib("https://d3js.org/d3.v5.min.js", function () {
  mpld3_load_lib("https://mpld3.github.io/js/mpld3.v0.5.9.js", function () { 
    mpld3.register_plugin("animview", AnimViewPlugin);
    AnimViewPlugin.prototype = Object.create(mpld3.Plugin.prototype);
    AnimViewPlugin.prototype.constructor = AnimViewPlugin;
    AnimViewPlugin.prototype.requiredProps = ["data"];
    AnimViewPlugin.prototype.defaultProps = {}
    function AnimViewPlugin(fig, props){
        mpld3.Plugin.call(this, fig, props);
    };

    AnimViewPlugin.prototype.draw = function(){
        var data = this.props.data;
        console.log(data + "---");
    };
   })
})

var source = new EventSource(import.meta.env.VITE_BACKEND_URL+"/stream");
source.addEventListener('greeting', function(event) {
    var data = JSON.parse(event.data);
    console.log("The server says " + data.message);
}, false);
source.addEventListener('error', function(event) {
    console.error("Failed to connect to event stream.");
}, false);

function getFigure() {
  console.log(JSON.stringify(data));
  fetch(import.meta.env.VITE_BACKEND_URL+"/gettest", {//http://127.0.0.1:5000/gettest https://api.phosys.ovh/gettest
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      rejectUnauthorized: false,
    },
    body: JSON.stringify(data)
  })
      .then( response => {
        return response.json();
      })
      .then ( drawObj => {
        console.log(drawObj);
        document.getElementById("canvas").innerHTML = "";
        mpld3.draw_figure("canvas", drawObj);
      })
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
