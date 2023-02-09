<script>
import {data} from './data.js'
export default {
    data(){
        return{
            data
        };
    },
    props: ['selectedShape'],
    computed:{
        getRelevantProperties(){
            let props=this.data.properties;
            if(this.selectedShape)props=this.selectedShape.properties;
            return props;
        }
    }
};
//todo: property data structure
//update properties in object data
//get selected object name and get related properties
</script>

<style>
</style>
<template>
    <h1>Properties</h1>
    <div v-for="property in getRelevantProperties" class="property">
        <div>{{ property.propertyName }}</div>
        <div class="propertydata">
            <input class="propertyrange" type="range" v-model="property.value" :min="property.min" :max="property.max">
            <input class="propertytext" type="number" v-model.number="property.value" :min="property.min" :max="property.max">
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