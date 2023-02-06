<script>
export default {
    data(){
        return{
            properties:{
                global: [{
                    propertyName:"globalProperty1",
                    value:0
                },
                {
                    propertyName:"globalProperty2",
                    value:0
                }],
                pointsource: 
                [{
                    propertyName:"pointsourceProperty1",
                    value:0
                },
                {
                    propertyName:"pointsourceProperty2",
                    value:0
                }],
                object:
                [{
                    propertyName:"objectProperty1",
                    value:0
                },
                {
                    propertyName:"objectProperty2",
                    value:0
                }]
            }
        };
    },
    props: ['selectedShape'],
    computed:{
        getRelevantProperties(){
            let name=this.selectedShape;
            if(name==='')name="global";
            else name=name.split('_')[0];
            return this.properties[`${name}`];
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
            <input class="propertyrange" type="range" v-model="property.value" min="0" max="100">
            <input class="propertytext" type="number" v-model.number="property.value" min="0" max="100">
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