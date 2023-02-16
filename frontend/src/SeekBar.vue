<script>
import { frames } from './result.js'

var fps = 30;

export default {
    data(){
        return {
            frames,
            fps
        }
    },
}
</script>

<template>
    <div class="seekBar">
        <input type="range" min="1" :max="frames.maxFrame" v-model.number="frames.frameNum" class="slider"><!--TODO add max-->
        <div class="controls">
            <div class="center-buttons">
                <button @click="frames.firstFrame"><i class="fa-solid fa-backward-step"></i></button>
                <button @click="frames.previousFrame"><i class="fa-solid fa-caret-left"></i></button>
                <button @click="frames.startStop" style="font-size: 25px;" class="fa-solid" :class="frames.playing ? 'fa-pause' : 'fa-play'"></button>
                <button @click="frames.nextFrame"><i class="fa-solid fa-caret-right"></i></button>
                <button @click="frames.lastFrame"><i class="fa-solid fa-forward-step"></i></button>
            </div>
            <div class="right-options">
                <input v-model.lazy.number="frames.frameNum" type="number"/>
                <input v-model.lazy.number="frames.fps" type="number"/>
            </div>
        </div>
    </div>
</template>

<style scoped>
    .seekBar {
        display: block;
    }
    input.slider {
        width: 100%;
    }
    .controls {
        height: 50px;
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
    }
    .controls > * {
        display: flex;
        margin: 1px;
        padding: 5px;
    }
    .center-buttons {
        flex: 0 1 auto;
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
    }
    .center-buttons > * {
        font-size: 20px;
    }
    .right-options {
        flex: 0 1 auto;
        margin-left: auto;
    }
    .right-options > * {
        width: 70px;
        height: 10px;
        padding: 10px;
    }
</style>