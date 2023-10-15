<script>
import { Splitpanes, Pane } from 'splitpanes'
export default {
    data() {
      return {
        panes:[1,1]
      };
    },
    components: {
        Splitpanes,
        Pane
    },
    props: ['container_id', 'horizontal'],
    methods:{
      horizontalSplit(index){
        if(this.horizontal){
          this.panes.push(1);
          return;
        }
        this.panes[index]=0;
      },
      verticalSplit(index){
        if(this.horizontal){
          this.panes[index]=0;
          return;
        }
        this.panes.push(1);
      }
    }
    
};
</script>


<template>

<splitpanes :horizontal="!horizontal">
  <pane v-for="(pane, index) in panes" :key="index">
    <div v-if="pane" class="view-container" style="position: relative;">
      <div class="view" :id="container_id"></div>
      <div id="view-options">
        <select name="Views" id="view-selection">
          <option>View 1</option>
          <option>View 2</option>
          <option>View 3</option>
          <option>View 4</option>
        </select>
        <button @click="horizontalSplit(index)"><img src="split.svg"/></button>
        <button @click="verticalSplit(index)"><img src="split.svg" style="transform:rotate(90deg);"/></button>
        <button><img src="close.svg"/></button>
      </div>
    </div>
    <ResultView v-if="!pane" :horizontal="!horizontal"></ResultView>
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