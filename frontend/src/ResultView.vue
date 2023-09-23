<script>
export default {
    props: ['container_id'],
};
</script>


<template>
<div class="view-container" style="position: relative;">
  <div class="view" :id="container_id"></div>
  <select name="Views" id="view-selection">
    <option>View 1</option>
    <option>View 2</option>
    <option>View 3</option>
    <option>View 4</option>
  </select>
</div>
</template>

<style>
.view{
    height:100%;
    min-height: 0;
    border-style: solid;
  border-color: coral;
}
#view-selection{
  position: absolute;
  top:3px;
  left:3px;
  height: auto;
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
</style>