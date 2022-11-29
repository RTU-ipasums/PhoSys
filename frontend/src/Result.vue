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
  mpld3_load_lib("https://mpld3.github.io/js/mpld3.v0.5.8.js", function () {  })
})
function getFigure() {
  console.log(JSON.stringify(data));
  fetch("http://192.168.1.131:5001/api/gettest", {
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
        document.getElementById("fig_main").innerHTML = "";
        mpld3.draw_figure("fig_main", drawObj);
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
