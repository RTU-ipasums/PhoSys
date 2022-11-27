<script setup>
import { ref } from 'vue'

let SimObject = class {
    constructor(objType, drawObj) {
    this.objType = objType;
    this.drawObj = drawObj;
    }

    exportObj() {
    return {
        objType: this.objType,
        x: "200",//this.drawObj.value.attrs.x,
        y: "150",//this.drawObj.value.attrs.y,
        w: "100",//this.drawObj.value.attrs.width,
        h: "80",//this.drawObj.value.attrs.height,
    }
    }
}

var simObjs = [new SimObject("boundary", ref(null))]

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
  fetch("http://127.0.0.1:5000/gettest", {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(simObjs.map( obj => obj.exportObj()) ),
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
