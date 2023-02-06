<script>
export default {
    data(){
        return{
            sliderValue:0,
            propertyName:"Test"
        };
    }
};
</script>

<style>
</style>
<template>
    <h1>Properties</h1>
    <div class="property">
        <div>{{ propertyName }}</div>
        <div class="propertydata">
            <input class="propertyrange" type="range" v-model="sliderValue" min="0" max="100">
            <input class="propertytext" type="number" v-model.number="sliderValue" min="0" max="100">
        </div>
    </div>
</template>
<style scoped>
    h1{
        padding-bottom: 15px;
        border-bottom: 1px solid rgba(167, 161, 161, 1);
    }
    .propertyrange{
        flex:4 1 0;
    }
    .propertytext{
        flex:1 1 0;
    }
    .propertydata{
        display:flex;
        
        gap: 5px;
    }
    .property{
        padding-bottom: 20px;
        text-align: left;
        border-bottom: 1px solid rgba(167, 161, 161, 1);;
    }
    input{
        width:100%;
    }
</style>