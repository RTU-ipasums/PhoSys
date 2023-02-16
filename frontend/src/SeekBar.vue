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
        <div class="seek-container">
            <input v-model.lazy.number="frames.frameNum" type="number"/>
            <input type="range" min="1" :max="frames.maxFrame" v-model.number="frames.frameNum" class="slider"><!--TODO add max-->
            <input :value="frames.frameMax" @input="setMaxFrame" type="number"/>
        </div>
        <div class="controls">
            <div class="left-options">
                <div class="control">
                    <div>FPS</div>
                    <input v-model.lazy.number="frames.fps" type="number"/>
                </div>
                
            </div>
            <div class="center-buttons">
                <i @click="frames.firstFrame" class="fa-solid fa-backward-step"></i>
                <i @click="frames.previousFrame" class="fa-solid fa-caret-left"></i>
                <i @click="frames.startStop" class="fa-solid" :class="frames.playing ? 'fa-pause' : 'fa-play'"></i>
                <i @click="frames.nextFrame" class="fa-solid fa-caret-right"></i>
                <i @click="frames.lastFrame" class="fa-solid fa-forward-step"></i>
            </div>
        </div>
    </div>
</template>

<style scoped>
    .seekBar{
        padding:5px 10px;
    }
    .controls{
        display: grid;
        grid-template-columns: 1fr repeat(3, auto) 1fr;
        grid-column-gap: 5px;
        justify-items: center;
        align-items: center;
    }
    .left-options{
        width:100%;
        
        display:flex;
        grid-column-start: 1;
    }
    .center-buttons{
        display:flex;
        gap:10px;
        grid-column-start: 2;
        align-items: center;
    }
    .center-buttons > *{
        width:30px;
        height:30px;
        font-size:30px;
        text-align: center;
        transition:0.4s;
    }
    .center-buttons > *:hover{
        background-color: #2c3e50;
        color:white;
    }
    .seek-container{
        display:flex;
        margin-bottom: 10px;
    }
    .control{
        display:flex;
    }
    .slider{
        flex:1;
    }

</style>