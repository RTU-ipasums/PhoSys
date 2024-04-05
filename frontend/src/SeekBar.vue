<script>
import Result from './Result.vue'
import { data, internal } from './data.js'

export default {
    data() {
        return {
            internal,
            data
        }
    },
    props:['resultView'],
    mounted() {
    window.addEventListener('keydown', e => {
      const key = e.key;
      if (key === " " && e.target.tagName === "BUTTON") {
            e.preventDefault();
        }
      switch (key) {
        case " ":
          this.resultView.togglePlay();
          break;
      }
    });
  }
}
</script>

<template>
    <div class="container">
        <div class="seekBar">
            <div class="seek-container">
                <input v-if="internal" v-model.lazy.number="internal.currentFrame" type="number" @change="resultView.setFrame(internal.currentFrame)"/>
                <input v-if="internal && resultView" type="range" min="1" :max="resultView.maxFrame" v-model.number="internal.currentFrame" @change="resultView.setFrame(internal.currentFrame)" class="slider">
                <input v-model.lazy.number="data.frameCount" type="number"/>
            </div>
            <div class="controls">
                <div class="left-options">
                    <div class="control">
                        <label for="fps-input">FPS</label>
                        <input v-if="this.resultView" v-model.lazy.number="resultView.fps" id="fps-input" type="number" />
                    </div>

                </div>
                <div class="center-buttons">
                    <i @click="resultView.setFirstFrame" class="fa-solid fa-backward-step"></i>
                    <i @click="resultView.setPreviousFrame" class="fa-solid fa-caret-left"></i>
                    <i @click="resultView.togglePlay" class="fa-solid" :class="this.resultView?.isPlaying ? 'fa-pause' : 'fa-play'"></i>
                    <i @click="resultView.setNextFrame" class="fa-solid fa-caret-right"></i>
                    <i @click="resultView.setLastFrame" class="fa-solid fa-forward-step"></i>
                </div>
                <div class="loader-container" :style="{ 'visibility': (this.resultView?.isGenerating ? 'visible' : 'hidden') }">
                    <div class="loader"></div>
                    <div class="loading-text">Generating frames</div>
                </div>

            </div>
        </div>
    </div>
</template>

<style scoped>
.container {
    background-color: rgb(184, 184, 184);
    width: 100%;
}

.loader-container {

    display: flex;
    align-items: center;
    gap: 10px;

    grid-column-start: 3;
    width: 100%;
    justify-content: right;
}

.loading-text {
    font-weight: bold;
}

.loading-text::after {
    display: inline-block;
    width: 0px;
    animation: dots steps(1) 1s infinite;
    content: '';
}

.loader {
    border: 5px solid #676774;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    border-bottom-color: transparent;
    min-width: 30px;
    min-height: 30px;
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}

@keyframes dots {
    0% {
        content: '';
    }

    25% {
        content: '.';
    }

    50% {
        content: '..';
    }

    75% {
        content: '...';
    }

    100% {
        content: '';
    }
}

input[type=number] {
    background: transparent;
    border: 0;
    border-bottom: 2px solid #676774;
    width: 100%;
    max-width: 100px;
    outline: 0;
    transition: 0.1s;
}

input[type=number]:focus {
    border-bottom: 2px solid #f6c737;
}

.seekBar {
    padding: 5px 10px;
    max-width: 1000px;
    width: 100%;
    margin: 0 auto;
}

.controls {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-column-gap: 5px;
    justify-items: center;
    align-items: center;
}

.left-options {
    width: 100%;
    display: flex;
    grid-column-start: 1;
}

.center-buttons {
    display: flex;
    gap: 10px;
    grid-column-start: 2;
}

.center-buttons>* {
    width: 30px;
    height: 30px;
    font-size: 30px;
    text-align: center;
    transition: 0.4s;
}

.center-buttons>*:hover {
    background-color: #2c3e50;
    color: white;
}

.seek-container {
    display: flex;
    margin-bottom: 10px;
    gap: 10px;
}

label {
    text-transform: uppercase;
    font-weight: bold;
}

.control {
    display: flex;
    gap: 5px;
}

.slider {
    flex: 1;
}
</style>