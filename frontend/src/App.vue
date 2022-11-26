<script setup>
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
  mpld3_load_lib("https://mpld3.github.io/js/mpld3.v0.5.8.js", function () {

    fetch("http://127.0.0.1:5000/gettest")
      .then( response => {
        return response.json();
      })
      .then ( drawObj => {
        console.log(drawObj);
        mpld3.draw_figure("fig_main", drawObj);
      })
  })
})
</script>

<template>
  <div id="fig_main">

  </div>
</template>

<style scoped>
</style>
