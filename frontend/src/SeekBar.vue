<script>
import { frames } from './result.js'

export default {
    data() {
        return {
            frames
        }
    },
}
</script>

<template>
    <div class="container">
        <div class="seekBar">
            <div class="seek-container">
                <input v-model.lazy.number="frames.frameNum" type="number" />
                <input type="range" min="1" :max="frames.maxFrame" v-model.number="frames.frameNum"
                    class="slider"><!--TODO add max-->
                <input :value="frames.frameMax" @input="setMaxFrame" type="number" />
            </div>
            <div class="controls">
                <div class="left-options">
                    <div class="control">
                        <label for="fps-input">FPS</label>
                        <input v-model.lazy.number="frames.fps" id="fps-input" type="number" />
                    </div>

                </div>
                <div class="center-buttons">
                    <i @click="frames.firstFrame" class="fa-solid fa-backward-step"></i>
                    <i @click="frames.previousFrame" class="fa-solid fa-caret-left"></i>
                    <i @click="frames.startStop" class="fa-solid" :class="frames.playing ? 'fa-pause' : 'fa-play'"></i>
                    <i @click="frames.nextFrame" class="fa-solid fa-caret-right"></i>
                    <i @click="frames.lastFrame" class="fa-solid fa-forward-step"></i>
                </div>
                <div class="loader-container">
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
    width: 30px;
    height: 30px;
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
    width: 100px;
    outline: 0;
    transition: 0.1s;
}

input[type=number]:focus {
    border-bottom: 2px solid #7dff71;
}

.seekBar {
    padding: 5px 10px;
    max-width: 1000px;
    width: 100%;
    margin: 0 auto;

}

.controls {
    display: grid;
    grid-template-columns: repeat(3, auto);
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
    align-items: center;
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