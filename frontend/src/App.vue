<script>
import Draw from './Draw.vue'
import Result from './Result.vue'
export default {
  name: 'UI',
  components: {
    Draw,
    Result
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

    <div class="grid-item editor" id="editor">
      <Draw ref="draw"/>
    </div>

    <div class="grid-item canvas" id="canvas">
      <Result ref="result"/>
    </div>
  </div>
</template>

<style scoped>
.u-i-container {
  height: 100vh;
  width: 100vw;
  display: grid;
  grid-template-rows: 100px 1fr;
  grid-template-columns: 1fr 1fr;
  grid-gap: 10px;
  background-color: rgba(167, 161, 161, 1);
}

.grid-item {
  background-color: rgba(255, 255, 255, 1);
  text-align: center;
  padding: 20px;
}

.top-bar {
  padding: 5px;
  grid-column: 1 / span 2;
  display: flex;
  flex-direction: row;
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
  padding: 10px;
  font-size: 2em;
  border-radius: 10px;
  background-color: rgb(43, 255, 0);
  position: relative;
  border: none;
}
</style>