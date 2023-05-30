<script>
import {data} from './data.js'
export default {
    data(){
        return{
            data
        };
    },
    props: ['selectedShapes'],
    computed:{
        //todo fix to work with multiple shapes
        getRelevantProperties(){
            let props=this.data.properties;
            if(this.selectedShapes?.size===1){
                props=[...this.selectedShapes][0].properties;
            }
            return props;
        },
        getCoords(){
            const props = {};
            if (this.selectedShapes?.size === 1) {
                const { x, y } = [...this.selectedShapes][0];
                props.x = Math.round((x + Number.EPSILON) * 100) / 100;
                props.y = Math.round((y + Number.EPSILON) * 100) / 100;
            }
            return props;
        },
        getPropertyTitle(){
            let title=this.data.propertyTitle;
            if(this.selectedShapes?.size===1)title=[...this.selectedShapes][0].propertyTitle;
            return title;
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
    <div class="header">
        <h1>Properties</h1>
        <div>{{ getPropertyTitle }}</div>
        <div v-if="getCoords.x||getCoords.x===0"><b>X </b>{{ getCoords.x }} <b>Y </b>{{ getCoords.y }}</div>
    </div>
    <div v-for="property in getRelevantProperties" :key="property" class="property">
        <div>{{ property.propertyName }}</div>
        <div class="propertydata">
            <input class="propertyrange" type="range" v-model="property.value" :min="property.min" :max="property.max">
            <input class="propertytext" type="number" v-model.number="property.value" :min="property.min" :max="property.max">
        </div>
    </div>
</template>
<style scoped>
    .header{
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