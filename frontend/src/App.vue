<script>
import Draw from './Draw.vue'
import Result from './Result.vue'
import Properties from './Properties.vue'
import { Splitpanes, Pane } from 'splitpanes'
import 'splitpanes/dist/splitpanes.css'

export default {
  name: 'UI',
  components: {
    Draw,
    Result,
    Splitpanes, 
    Properties,
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
        <button class="run-button" @click="this.$refs.result.getFigure()" title="Start simulation">▶&#xFE0E; LAUNCH</button>
      </div>
    </div>
    <splitpanes id="splitpanes" @resized="this.$refs.draw.updateSize(this.$refs.flexeditor.offsetWidth, this.$refs.flexeditor.offsetHeight)">
      <pane size="20" class="properties grid-item">
        <Properties/>
      </pane>
      <pane>
        <div class="editor-canvas-container">
          <div class="grid-item editor" id="editor" ref="flexeditor">
            <Draw ref="draw"/>
          </div>
          <div class="grid-item canvas" id="canvas">
            <Result ref="result" />
          </div>
        </div>
      </pane>

    </splitpanes>
  </div>
</template>

<style>
.editor-canvas-container{
  display:flex;
  width:100%;
  gap:6px;
  height:100%;
}
.grid-item{
  background-color: rgba(255, 255, 255, 1);
}
.editor-canvas-container > *{
  flex:1;
  height:100%;
  width:0;
}
.u-i-container {
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  row-gap: 10px;
  background-color: rgba(167, 161, 161, 1);
}

.properties {

  text-align: center;
  padding: 10px 20px;
}

.top-bar {
  height: 50px;
  padding: 5px;
  display: flex;
  flex-direction: row;
}

.canvas {
  padding: 0px;
}

.tool-buttons {
  display: flex;
  flex-direction: row;
  position: relative;
  padding-right: 10px;
  gap:10px;
}

.action-buttons {
  margin-left: auto;
  display: flex;
  flex-direction: row-reverse;
  justify-content: center;
  align-items: center;
  position: relative;
  height: 100%;
}

.bar-button {
  cursor: pointer;
  max-height: 100%;
  max-width: 100%;
}

.run-button {
  max-height: 100%;
  cursor: pointer;
  font-weight: bold;
  padding: 10px;
  font-size: 1em;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #7dff71;
  border:4px solid #21d211;
}
.run-button:hover{
  background-color: #57ef49;
  border-color: #20b512;
}
.run-button:active{
  background-color: #20b512;
  border-color:#158e09;
}
.run-button:focus{
  border:4px solid #21d211;
}
*{
  font-family: Helvetica, Arial;
}
#splitpanes{
  overflow:auto;
}
.splitpanes__splitter {
  min-width: 6px !important;
  background: rgba(167, 161, 161, 1);
}
</style>