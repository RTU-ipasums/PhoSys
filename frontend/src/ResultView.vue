<script>
export default {
    props: ['container_id'],
};
</script>


<template>
<div class="view-container" style="position: relative;">
  <div class="view" :id="container_id"></div>
  <div id="view-options">
    <select name="Views" id="view-selection">
      <option>View 1</option>
      <option>View 2</option>
      <option>View 3</option>
      <option>View 4</option>
    </select>
  </div>

</div>
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