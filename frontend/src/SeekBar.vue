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
    <div>
        <input type="range" min="1" v-model.number="frames.frameNum" class="slider"><!--TODO add max-->
        <div class="controls">
            <div class="center-buttons">
                <button @click="frames.startStop">{{ frames.playing?'⏸':'⏵' }}</button>
            </div>
            <div class="right-options">
                <input v-model.lazy.number="frames.frameNum" type="number"/>
                <input v-model.lazy.number="frames.fps" type="number"/>
            </div>
        </div>
    </div>
</template>

<style scoped>
    input.slider {
        width: 100%;
    }
    .controls {
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