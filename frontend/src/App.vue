<script>
import Draw from './Draw.vue'
import Result from './Result.vue'
import { Splitpanes, Pane } from 'splitpanes'
import 'splitpanes/dist/splitpanes.css'

export default {
  name: 'UI',
  components: {
    Draw,
    Result,
    Splitpanes, 
    Pane
  }
}
</script>

<template>
  <div class="u-i-container">
    <div class="grid-item top-bar">
      <div class="tool-buttons">
        <img class="bar-button" title="Open from file" alt="open" src="/playground_assets/folder1232-10tn-200w.png"/>
        <img class="bar-button" @click="this.$refs.draw.addRect()" title="Add object" alt="object" src="/playground_assets/newpiskel1107-1uh4-200h.png"/>
        <img class="bar-button" @click="this.$refs.draw.addCircle()" title="Add point lightsource" alt="point lightsource" src="/playground_assets/newpiskel2196-3eug-200h.png"/>
      </div>
      <div class="action-buttons">
        <span class="run-button" @click="this.$refs.result.getFigure()" title="Start simulation">▷ LAUNCH</span>
      </div>
    </div>

    <splitpanes>
      <pane size="14" class="grid-item properties">
        <h1>Properties</h1>
      </pane>

      <pane class="grid-item editor" id="editor">
        <Draw ref="draw"/>
      </pane>

      <pane class="grid-item canvas" id="canvas">
        <Result ref="result"/>
      </pane>
    </splitpanes>
  </div>
</template>

<style>
.u-i-container {
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  row-gap: 10px;
  background-color: rgba(167, 161, 161, 1);
}

.grid-item {
  background-color: rgba(255, 255, 255, 1);
  text-align: center;
  padding: 20px 0;
}

.top-bar {
  padding: 5px;
  display: flex;
  flex-direction: row;
}

.properties {
}

.editor {
}

.canvas {
  padding: 0px;
}

.tool-buttons {
  display: flex;
  flex-direction: row;
  position: relative;
  height: 100%;
  padding-right: 10px;
}

.action-buttons {
  margin-left: auto;
  display: flex;
  flex-direction: row-reverse;
  justify-content: center;
  align-items: center;
  position: relative;
  height: 100%;
  padding-right: 10px;
}

.bar-button {
  cursor: pointer;
  padding: 10px;
}

.run-button {
  cursor: pointer;
  height: 60%;
  padding: 10px;
  font-size: 3em;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #28FF00;
  position: relative;
  border: none;
}

.splitpanes__splitter {
  min-width: 6px !important;
  background: rgba(167, 161, 161, 1);
}
</style>