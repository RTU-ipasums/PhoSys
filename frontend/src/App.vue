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
    <div class="u-i-u-i">
      <div class="u-i-rightarea">
        <span class="u-i-text"><span>OUTPUT AREA</span></span>
        <Result ref="childcomp2"/>
      </div>
      <div class="u-i-top-bar">
        <div class="u-i-saveicon">
          <img alt="folder1232" src="/playground_assets/folder1232-10tn-200w.png" class="u-i-folder1" />
          <span class="u-i-text02"><span>save</span></span>
        </div>
        <div @click="this.$refs.childcomp1.addRect()" class="u-i-objecticon">
          <span class="u-i-text04"><span>object</span></span>
          <img alt="NewPiskel1107" src="/playground_assets/newpiskel1107-1uh4-200h.png" class="u-i-new-piskel1" />
        </div>
        <div @click="this.$refs.childcomp1.addCircle()" class="u-i-lightbulbicon">
          <span class="u-i-text06"><span>lightbulb</span></span>
          <img alt="NewPiskel2196" src="/playground_assets/newpiskel2196-3eug-200h.png" class="u-i-new-piskel21" />
        </div>
        <div class="u-i-launchicon">
          <img alt="Rectangle162" src="/playground_assets/rectangle162-ktgc.svg" class="u-i-rectangle1" />
          <span @click="this.$refs.childcomp2.getFigure()" class="u-i-text08">▷ LAUNCH</span>
        </div>
      </div>
      <div class="u-i-leftarea">
        <span class="u-i-text09"><span>INPUT AREA</span></span>
        <Draw ref="childcomp1"/>
      </div>
    </div>
  </div>
</template>
<style scoped>
.u-i-container {
  height: 100vh;
  width:100vw;
  background-color: rgba(167, 161, 161, 1);
  display: flex;
  justify-content: center;
  align-items: center;
}

.u-i-u-i {
  width: 100%;
  height: 1080px;
  width: 1920px;
  display: flex;
  position: relative;
  align-items: flex-start;
  flex-shrink: 0;
  border-color: transparent;
}

.u-i-rightarea {
  top: 169px;
  left: 969px;
  width: 950px;
  height: 911px;
  display: flex;
  padding: 0;
  position: absolute;
  align-self: auto;
  box-sizing: border-box;
  align-items: flex-start;
  flex-shrink: 1;
  border-color: transparent;
  border-style: none;
  border-width: 0;
  margin-right: 0;
  border-radius: 0px 0px 0px 0px;
  margin-bottom: 0;
  flex-direction: row;
  justify-content: flex-start;
  background-color: rgba(217, 217, 217, 1);
}

.u-i-text {
  left: 703px;
  color: rgba(0, 0, 0, 1);
  width: 248px;
  height: auto;
  position: absolute;
  font-size: 30px;
  align-self: auto;
  box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
  font-style: Regular;
  text-align: center;
  font-family: Arial, Helvetica, sans-serif;
  font-weight: 400;
  line-height: normal;
  font-stretch: normal;
  text-decoration: underline;
}

.u-i-top-bar {
  top: 0px;
  left: 0px;
  width: 1920px;
  height: 154px;
  display: flex;
  padding: 13px 63px;
  position: absolute;
  align-items: center;
  flex-shrink: 0;
  border-color: transparent;
  justify-content: space-between;
  background-color: rgba(217, 217, 217, 1);
}

.u-i-saveicon {
  width: 85px;
  height: 121px;
  display: flex;
  padding: 0;
  position: relative;
  align-self: auto;
  box-sizing: border-box;
  align-items: flex-start;
  flex-shrink: 1;
  border-color: transparent;
  border-style: none;
  border-width: 0;
  border-radius: 0px 0px 0px 0px;
  flex-direction: row;
  justify-content: flex-start;
  background-color: transparent;
}

.u-i-folder1 {
  top: 0px;
  left: 0px;
  width: 85px;
  height: 85px;
  position: absolute;
  border-color: transparent;
  border-radius: 10px;
}

.u-i-text02 {
  top: 85px;
  left: 9px;
  color: rgba(0, 0, 0, 1);
  height: auto;
  position: absolute;
  font-size: 30px;
  align-self: auto;
  font-style: Regular;
  text-align: center;
  font-family: Arial, Helvetica, sans-serif;
  font-weight: 400;
  line-height: normal;
  font-stretch: normal;
  text-decoration: none;
}

.u-i-objecticon {
  left: 174px;
  width: 158px;
  bottom: 10px;
  height: 126px;
  margin: auto;
  display: flex;
  padding: 0;
  position: absolute;
  align-self: auto;
  box-sizing: border-box;
  align-items: flex-start;
  flex-shrink: 1;
  border-color: transparent;
  border-style: none;
  border-width: 0;
  border-radius: 0px 0px 0px 0px;
  flex-direction: row;
  justify-content: flex-start;
  background-color: transparent;
}

.u-i-text04 {
  top: 85px;
  color: rgba(0, 0, 0, 1);
  width: 158px;
  height: auto;
  position: absolute;
  font-size: 30px;
  align-self: auto;
  font-style: Regular;
  text-align: center;
  font-family: Arial, Helvetica, sans-serif;
  font-weight: 400;
  line-height: normal;
  font-stretch: normal;
  text-decoration: none;
}

.u-i-new-piskel1 {
  top: 0px;
  left: 36px;
  width: 85px;
  height: 85px;
  position: absolute;
  border-color: transparent;
  border-radius: 10px;
}

.u-i-lightbulbicon {
  left: 299px;
  width: 197px;
  bottom: 11px;
  height: 127px;
  display: flex;
  padding: 0;
  position: absolute;
  align-self: auto;
  box-sizing: border-box;
  align-items: flex-start;
  flex-shrink: 1;
  border-color: transparent;
  border-style: none;
  border-width: 0;
  border-radius: 0px 0px 0px 0px;
  justify-content: flex-start;
  background-color: transparent;
}

.u-i-text06 {
  top: 85px;
  color: rgba(0, 0, 0, 1);
  width: 197px;
  height: auto;
  position: absolute;
  font-size: 30px;
  align-self: auto;
  font-style: Regular;
  text-align: center;
  font-family: Arial, Helvetica, sans-serif;
  font-weight: 400;
  line-height: normal;
  font-stretch: normal;
  text-decoration: none;
}

.u-i-new-piskel21 {
  top: 0px;
  left: 56px;
  width: 85px;
  height: 85px;
  position: absolute;
  border-color: transparent;
  border-radius: 10px;
}

.u-i-launchicon {
  width: 253px;
  height: 80px;
  display: flex;
  padding: 0;
  z-index: 100;
  position: relative;
  align-self: auto;
  box-sizing: border-box;
  align-items: flex-start;
  flex-shrink: 1;
  border-color: transparent;
  border-style: none;
  border-width: 0;
  border-radius: 0px 0px 0px 0px;
  flex-direction: row;
  justify-content: flex-start;
  background-color: transparent;
}

.u-i-rectangle1 {
  top: 0px;
  left: 2px;
  width: 251px;
  height: 80px;
  z-index: -1;
  position: absolute;
}

.u-i-text08 {
  color: rgb(0, 0, 0);
  width: 251px;
  height: auto;
  z-index: 100;
  font-size: 30px;
  align-self: center;
  font-style: Regular;
  text-align: center;
  font-family: Arial, Helvetica, sans-serif;
  font-weight: 400;
  line-height: normal;
  font-stretch: normal;
  text-decoration: none;
}

.u-i-leftarea {
  top: 169px;
  left: 0px;
  width: 950px;
  height: 911px;
  display: flex;
  padding: 0;
  position: absolute;
  align-self: auto;
  box-sizing: border-box;
  align-items: flex-start;
  flex-shrink: 1;
  border-color: transparent;
  border-style: none;
  border-width: 0;
  margin-right: 0;
  border-radius: 0px 0px 0px 0px;
  margin-bottom: 0;
  flex-direction: row;
  justify-content: flex-start;
  background-color: rgba(217, 217, 217, 1);
}

.u-i-text09 {
  color: rgba(0, 0, 0, 1);
  width: 248px;
  height: auto;
  position: absolute;
  font-size: 30px;
  align-self: auto;
  box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
  font-style: Regular;
  text-align: center;
  font-family: Arial, Helvetica, sans-serif;
  font-weight: 400;
  line-height: normal;
  font-stretch: normal;
  text-decoration: underline;
}
</style>
