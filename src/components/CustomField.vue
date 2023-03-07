<template lang="pug">
v-card.form.mt-1
  div(
    v-for="key in Object.keys(templateJson)" 
    v-if="!['id','modded'].includes(key)"
  )
    v-col
      v-text-field(
        v-if="(typeof templateJson[key] === 'number' || typeof templateJson[key] === 'string')"
        v-model="templateJson[key]"
        :label="firstLetterUp(key)"
        @input="onUpdate($event,key)"
        hide-details
        rows=2
      )
      array-field(
        v-if="Array.isArray(templateJson[key])"
        :obj="templateJson[key]"
        @update="onUpdate($event,key)"
      )
  v-spacer
  v-checkbox(
    v-model="templateJson['modded']"
    label="Already Modded"
    hide-details
    @change="onUpdate($event,'modded')"
  )
  
</template>
  
<script>
import ArrayField from './ArrayField.vue'
  export default {
    name: 'CustomField',
    components:{
      ArrayField
    },
    props:{
      index:{
        type:Number
      },
      obj:{
        type:Object
      }
    },
    created() {
      //type
      //typeof obj[key]
      Object.keys(this.obj).forEach(x=>{
        this.templateJson[x]=this.obj[x]
      })
      /*
      todo create an anyfield that can work with all sorts of types
      ArrayField gets an array as input
      *creates the input fields for the elements
      *add/delete button's for entries
      */


    },
    data() {
  
      return {
        levelColor:[
          '#ffffff',
          '#f5f5f5',
          '#fff2cc',
          '#ffe6cc',
          '#f8cecc',
          '#e1d5e7',
          '#e6d0de', //nothing should be longer than 6 nestings if so idc anymore
          '#e6d0de',
          '#e6d0de',
          '#e6d0de',
          '#e6d0de',
          '#e6d0de',
          '#e6d0de',
          '#e6d0de',
          '#e6d0de',
          '#e6d0de', //if we ever reach this point god lord what monster of json are we looking at??
        ],
        templateJson:{}
      }
    },
    methods: {
      emit(){
        console.log('customfield update')
        this.$emit('update',{content:this.templateJson,index:this.index})
      },
      firstLetterUp(str){
        return str.charAt(0).toUpperCase() + str.slice(1);
      },
      onUpdate(e,key){
        console.log(e,key)
        this.templateJson[key] = e
        this.emit()
      },  
    }, 
  }
  </script>
  
  <style scoped>
.form{
  max-width: fit-content;
}
.col{
  padding: 0px;
}
  </style>