<script>
import { Splitpanes, Pane } from 'splitpanes'
import { reactive } from 'vue'
export default {
  data() {
    return {
      panes: []
    };
  },
  components: {
      Splitpanes,
      Pane
  },
  props: ['container_id', 'horizontal', 'parentpane'],
  methods:{
    horizontalSplit(index){
      if(this.horizontal){
        this.panes.push({view: this.panes[this.panes.length-1].view + 1, split: false});
        return;
      }
      this.panes[index].split = true;
    },
    verticalSplit(index){
      if(this.horizontal){
        this.panes[index].split = true;
        return;
      }
      this.panes.push({view: this.panes[this.panes.length-1].view + 1, split: false});
    },
    deletePane(index){
      //if only one top layer frame is remaining, don't allow the user to delete it
      //todo: maybe hide the icon
      if(!this.parentpane&&this.panes.length===1)return;
      this.panes.splice(index, 1);
      if(this.parentpane&&this.panes.length===1){
        //todo: maybe rework this
        //here we pray vue reactivity works by reference and that a vue element can delete itself
        //im not sure if this is a hack, but it works for now
        this.parentpane.split = false;
      }
    }
  },
  mounted() {
    if(this.initial){
      for(let i=0;i<this.initial.length;i++){
        this.panes.push({view: this.initial[i], split: false});
      }
      return;
    }
    //todo: maybe remove "view" attribute
    this.panes.push({view: 1, split: false});
    this.panes.push({view: 1, split: false});
  } 
};
</script>

<template>
<splitpanes :horizontal="!horizontal">
  <pane v-for="(pane,index) in panes" :key="index" ref="children">
    <div v-if="!pane.split" class="view-container" style="position: relative;">
      <div class="view" :id="container_id"></div>
      <div id="view-options">
        <select name="Views" id="view-selection">
          <option>View 1</option>
          <option>View 2</option>
          <option>View 3</option>
          <option>View 4</option>
        </select>
        <button @click="horizontalSplit(index)"><img src="/split.svg"/></button>
        <button @click="verticalSplit(index)"><img src="/split.svg" style="transform:rotate(90deg);"/></button>
        <button @click="deletePane(index)"><img src="/close.svg"/></button>
      </div>
    </div>
    <ResultView v-if="pane.split" :horizontal="!horizontal" :parentpane="panes[index]"></ResultView>
  </pane>
</splitpanes>
</template>

<style>
.view{
    height:100%;
    min-height: 0;
}
#view-options{
  position: absolute;
  top:0px;
  left:0px;
  height: auto;
  display:flex;
  height: 30px;
  gap:5px;
  padding:5px;
  background-color:rgba(167, 161, 161, 1);
}
.view-container{
  height:100%;
  min-height: 0;
}
.view>*{
height:100%;
display:flex;
}
.mpld3-figure {
  flex: 1;
  height: 100%;
}
img{
  height: 100%;
}
button{
  height: 100%;
}
</style>