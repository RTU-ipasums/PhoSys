<script>
import { frames, framesC } from './result.js'

var fps = 30;

export default {
    data(){
        return {
            frames,
            framesC,
            fps
        }
    },
}
</script>

<template>
    <div class="seekBar">
        <input type="range" min="1" v-model.number="frames.frameNum" class="slider"><!--TODO add max-->
        <div class="controls">
            <div class="center-buttons">
                <button @click="frames.firstFrame">⏮</button>
                <button @click="frames.previousFrame">⏴</button>
                <button @click="frames.startStop" style="font-size: 25px;">{{ frames.playing?'⏸':'►' }}</button>
                <button @click="frames.nextFrame">⏵</button>
                <button @click="frames.lastFrame">⏭</button>
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