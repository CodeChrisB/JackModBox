<template lang="pug">
  v-row.ma-1
    div(v-if="ceMode === '' || ceMode === null")
      CustomField.container(
        v-for="(obj,index) in internalValue.content"
        :obj="obj" 
        :index="index"
        :filter="internalFilter"
        :searchInput="internalSearch"
        show-modded
        v-on:update="onUpdate"
      )
    v-row.ml-5(v-if="ceMode==='FastPrompt'")
      v-textarea(
        v-model="fastPrompt.value",
        :rows="fastPrompt.rows",
      )
  
  </template>
      
  <script>
  import { CEErrors } from '@/assets/data/EditorValues'
  import CustomField from '@/components/Fields/CustomField.vue'
  export default {
    name: 'CustomEditor',
    components: {
      CustomField
    },
  
    data() {
      return {
        internalCeMode:'',
        internalValue: [],
        internalFilter: [],
        internalSearch:'',
        fastPrompt:{
          value:'',
          rows:1
        }
      }
    },
    props: {
      ceMode:{
        type:String
      },
      filter:{
        type:Array,
      },
      searchInput:{
        type:String
      },
      jsonFile: {
        type: Object
      }
    },
    created(){
        this.fastPrompt.value = this.internalValue.content.map(x=>x['question']).join('\n')
        this.fastPrompt.rows = this.fastPrompt.value.length
    },
    methods: {
      onUpdate(e) {
        //
        this.internalValue.content[e.index] = e.content
        this.$emit('changed', this.internalValue.content)
      },
    },
    watch: {
      jsonFile: {
        handler(newVal) {
  
          this.internalValue = newVal
          if (!newVal.content) { this.$emit('error', CEErrors.NoContent); return; }
          if (!Array.isArray(newVal.content)) { this.$emit('error', CEErrors.ContentNotArray); return; }
          if (Object.keys(newVal.content[0])[0] === 'id' && Object.keys(newVal.content[0]).length === 1) { this.$emit('error', CEErrors.OnlyIdContent); return; }
          this.internalValue = newVal
        },
        immediate: true
      }
    }
  
  }
  </script>
  <style scoped>
  .container {
    min-width: 40%;
    max-width: 100px;
  }
  </style>