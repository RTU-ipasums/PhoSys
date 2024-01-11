<script>
import { Splitpanes, Pane } from 'splitpanes'
export default {
  data() {
    return {
      panes: [
        {id: 0, split: false, selectedType:""},
        {id: 1, split: false, selectedType:""}
      ]
    };
  },
  components: {
      Splitpanes,
      Pane
  },
  props: ['views', 'horizontal', 'parentpane'],
  computed:{
    allowDeletion(){
      return this.parentpane||this.panes.length>1;
    }
  },
  methods:{
    horizontalSplit(pane){
      let index = this.panes.findIndex(p => p.id === pane.id);
      if(this.horizontal){
        this.panes.push({id: this.panes[this.panes.length-1].id + 1, split: false, selectedType:""});
        return;
      }
      this.panes[index].split = true;
      console.log(0, this.panes);
    },
    verticalSplit(pane){
      let index = this.panes.findIndex(p => p.id === pane.id);
      if(this.horizontal){
        this.panes[index].split = true;
        return;
      }
      this.panes.push({id: this.panes[this.panes.length-1].id + 1, split: false, selectedType:""});
      console.log(1, this.panes);
    },
    deletePane(pane){
      let index = this.panes.findIndex(p => p.id === pane.id);
      //if only one top layer frame is remaining, don't allow the user to delete it
      if(!this.allowDeletion)return;
      this.panes.splice(index, 1);
      if(this.parentpane&&this.panes.length===1){
        //todo: maybe rework this
        //here we pray vue reactivity works by reference and that a vue element can delete itself, im not sure if this is a hack, but it works for now
        this.parentpane.split = false;
      }
    }
  }
};
</script>

<template>
<splitpanes :horizontal="!horizontal">
  <pane v-for="(pane,index) in panes" :key="pane.id" ref="children">
    <div v-if="!pane.split" class="view-container" style="position: relative;">
      <div class="view"></div>
      <div id="view-options">
        <select v-model="pane.selectedType" name="Views" id="view-selection">
          <option disabled value="">None</option>
          <option value="" selected disabled hidden>Choose here</option>
          <option v-for="(view, key) in views" :value="view.type">{{key}}</option>
        </select>

        <button @click="horizontalSplit(pane)"><img src="/split.svg"/></button>
        <button @click="verticalSplit(pane)"><img src="/split.svg" style="transform:rotate(90deg);"/></button>
        <button v-if="allowDeletion" @click="deletePane(pane)"><img src="/close.svg"/></button>

      </div>
    </div>
    <ResultView v-if="pane.split" :views="views" :horizontal="!horizontal" :parentpane="panes[index]"></ResultView>
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