<script>
import { Splitpanes, Pane } from 'splitpanes'
import ResultView from './ResultView.vue'
export default {
  data() {
    return {
      lastid:1,
      panes: [
        {id: 0, split: false, selectedView:this.firstSelectedView?this.firstSelectedView:""},
        {id: 1, split: false, selectedView:""}
      ]
    };
  },
  components: {
      Splitpanes,
      Pane,
      ResultView
  },
  props: ['views', 'selectedViews','horizontal', 'parentpane', 'firstSelectedView'],
  computed:{
    //returns "" if view no longer exists
    safeView(){
      //todo: this is kinda cursed
      //todo: split map incrementing into seperate func and reuse it in this and "updateCount"
      return (pane)=>{
        if(!this.views[pane.selectedView]){
          for(let key of Object.keys(this.views)){

            if(!this.selectedViews[key]){
              if(!(key in this.selectedViews)){
                this.selectedViews[key]=0;
              }

              this.selectedViews[key]++;
              if(pane.selectedView){
                this.selectedViews[pane.selectedView]--;
              }

              pane.selectedView=key; 
            }
          }
          return ""
        }

        return pane.selectedView;
      }
    },
    allowDeletion(){
      return this.parentpane||this.panes.length>1;
    }
  },
  methods:{
    horizontalSplit(pane){
      let index = this.panes.findIndex(p => p.id === pane.id);
      if(this.horizontal){
        this.lastid++;
        this.panes.splice(index+1, 0, {id: this.lastid, split: false, selectedView:""});
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
      this.lastid++;
      this.panes.splice(index+1, 0, {id: this.lastid, split: false, selectedView:""});
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
    },
    updateCount(ev, pane){
      const newValue = ev.target.value;
      const oldValue = pane.selectedView;
      
      if(oldValue){
        this.selectedViews[oldValue]--;
      }
      if(newValue){
        if(!(newValue in this.selectedViews)){
          this.selectedViews[newValue]=0;
        }
        this.selectedViews[newValue]++;
      }
      pane.selectedView=newValue;
    }
  }
};
</script>

<template>
<splitpanes :horizontal="!horizontal" >
  <pane v-for="pane in panes" :key="pane.id" id="pane" ref="children">
    <div v-if="!pane.split" class="view-container" style="position: relative;">
      <!-- <div class="view"></div> -->
      <ResultView :view="safeView(pane)"/>
      <div id="view-options">
        <select :value="pane.selectedView" @change="updateCount($event,pane)" name="Views" id="view-selection">
          <option disabled value="">None</option>
          <option v-for="(view, key) in views" :value="key">{{key}}</option>
        </select>

        <button @click="horizontalSplit(pane)"><img src="/split.svg"/></button>
        <button @click="verticalSplit(pane)"><img src="/split.svg" style="transform:rotate(90deg);"/></button>
        <button v-if="allowDeletion" @click="deletePane(pane)"><img src="/close.svg"/></button>

      </div>
    </div>
    <ResultPane v-if="pane.split" :views="views" :selectedViews="selectedViews" :horizontal="!horizontal" :parentpane="pane" :firstSelectedView="pane.selectedView"></ResultPane>
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
#view-selection{
  width:100px;
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
  width: 100%;
  height: 100%;
}
img{
  height: 100%;
}
button{
  height: 100%;
}

</style>