<script>
import { data } from './data.js'
import Draw from './Draw.vue'
import * as defaults from './defaultObjects'
import Result from './Result.vue'
import SeekBar from './SeekBar.vue'
import Properties from './Properties.vue'
import { Splitpanes, Pane } from 'splitpanes'
import 'splitpanes/dist/splitpanes.css'

export default {
  components: {
    Draw,
    Result,
    SeekBar,
    Splitpanes,
    Properties,
    Pane
  },
  data() {
    return {
      isMounted: false,
      sizeObserver: null,
      resizeTimeoutId: undefined,
      data,
      defaults
    }
  },
  methods: {
    getShape() {
      if (!this.isMounted) return;
      return this.$refs.draw.selectedShapes;
    },
    saveSimulationData() {
      const data = JSON.stringify(this.data);
      const filename = 'PhosysSave.json';
      const blob = new Blob([data], { type: 'text/json' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.download = filename;
      link.href = url;
      link.click();
      window.URL.revokeObjectURL(url);
      link.remove();
    },
    openSimulationData() {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'application/json';
      input.addEventListener('change', (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.addEventListener('load', () => {
          const data = JSON.parse(reader.result);
          //this.data=data doesn't work
          Object.assign(this.data, data);
        });
        reader.readAsText(file);
      });
      input.click();
      input.remove();
    }
  },
  mounted() {
    this.isMounted = true;
    this.sizeObserver = new ResizeObserver(() => {
      //Resizes if no new resize event in the past 5ms
      if (this.resizeTimeoutId) {
        clearTimeout(this.resizeTimeoutId);
      }
      this.resizeTimeoutId = setTimeout(() => {
        this.$refs.draw.updateSize(this.$refs.flexeditor.offsetWidth, this.$refs.flexeditor.offsetHeight);
      }, 5)
    }).observe(this.$refs.flexeditor);
  }
}
</script>

<template>
  <div class="u-i-container">
    <nav class="grid-item top-bar">
      <div class="tool-buttons">
        <img class="logo" title="Phosys" alt="logo" src="/logo.png" />
        <img class="bar-button" @click="saveSimulationData()" title="Save simulation to file" alt="open"
          src="/save.png" />
        <img class="bar-button" @click="openSimulationData()" title="Open simulation from file" alt="open"
          src="/folder.png" />
        <img class="bar-button" @click="$refs.draw.addShape(defaults.defaultObject, 'object')" title="Add object" alt="object"
          src="/object.png" />
        <img class="bar-button" @click="$refs.draw.addShape(defaults.defaultPolygon, 'polygon')" title="Add polygon" alt="polygon"
          src="/object.png" />
        <img class="bar-button" @click="$refs.draw.addShape(defaults.defaultPointsource, 'pointsource')" title="Add point lightsource" alt="point lightsource"
          src="/light.png" />
        <img class="bar-button" @click="$refs.draw.addShape(defaults.defaultLinesource, 'linesource')" title="Add line lightsource" alt="line lightsource"
          src="/linesource.png" />
        <img class="bar-button" @click="$refs.draw.addShape(defaults.defaultLinedetector, 'linedetector')" title="Add line detector" alt="line detector"
          src="/linedetector.png" />
      </div>
      <button class="run-button" @click="$refs.result.startGeneration()" title="Start simulation"><i class="fa-solid fa-play"
          data-v-cb817a9a=""></i>&nbsp;LAUNCH</button>
    </nav>

    <splitpanes id="splitpanes">
      <pane size="20" class="properties grid-item">
        <Properties :selectedShapes="getShape()" />
      </pane>
      <pane>
        <div class="editor-canvas-container">
          <div class="grid-item editor" id="editor" ref="flexeditor">
            <Draw ref="draw" />
          </div>
          <div class="grid-item canvas" id="canvas">
            <Result ref="result" />
            <SeekBar :resultView="$refs.result"/>
          </div>
        </div>
      </pane>

    </splitpanes>


  </div>
</template>

<style>
*,
::before,
::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.logo {
  border-right: 2px solid gray;
  padding-right: 10px;
}

body {
  color: #2c3e50;
  line-height: 1.6;
}

.editor-canvas-container {
  display: flex;
  width: 100%;
  gap: 6px;
  height: 100%;
}

.grid-item {
  background-color: rgba(255, 255, 255, 1);
}

.editor-canvas-container>* {
  flex: 1;
  height: 100%;
  width: 0;
}

.u-i-container {
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  row-gap: 6px;
  background-color: rgba(167, 161, 161, 1);
}

.properties {
  text-align: center;
  padding: 10px 20px;
}

.canvas {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  z-index: 1;
}

.tool-buttons {
  display: flex;
  gap: 10px;
  min-width: 0px;
}

.tool-buttons>* {
  flex: 0;
}

.bar-button {
  cursor: pointer;
  max-height: 100%;
  max-width: 100%;
}

.top-bar {
  height: 56px;
  padding: 5px;
  display: flex;
  justify-content: space-between;
}

.run-button {
  height: 100%;
  white-space: nowrap;
  max-height: 100%;
  cursor: pointer;
  font-weight: bold;
  padding: 10px;
  font-size: 1.1em;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #7dff71;
  border: 4px solid #21d211;
}

.run-button:hover {
  background-color: #57ef49;
  border-color: #20b512;
}

.run-button:active {
  background-color: #20b512;
  border-color: #158e09;
}

.run-button:focus {
  border: 4px solid #21d211;
}

* {
  font-family: Helvetica, Arial;
}

#splitpanes {
  overflow: auto;
}

.splitpanes__splitter {
  min-width: 6px !important;
  background: rgba(167, 161, 161, 1);
}
</style>