<template lang="pug">
.customEditor
  v-row.ma-1
    v-col.col-2
      v-btn(@click="page(-1)") 
        | <
      v-btn(@click="page(1)")
        | >
    v-col.col-2
      v-select(
        v-model="pageSize"
        label="PageSize"
        :items="[1,2,4,8,16,totalItems]"
      )
    v-spacer
    v-col.col-2
      span {{ pageText }}
  v-divider.mb-4
  v-row
    div
    CustomField.container(
      v-for="(obj,i) in pageContent"
      :obj="obj" 
      :key="index"
      :index="getIndex(i)"
      :filter="internalFilter"
      :searchInput="internalSearch"
      show-modded
      v-on:update="onUpdate"
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
    props: {
      filter:{
        type:Array,
      },
      searchInput:{
        type:String
      },
      jsonContent: {
        type: Object
      }
    },
    data() {
      return {
        internalValue: [],
        internalFilter: [],
        internalSearch:'',
        //pagination
        pageSize:8,
        index:0,
      }
    },
    computed:{
      pageContent(){
        return this.internalValue.content.slice(
          this.pageSize*this.index,
          this.pageSize*(this.index+1)
        )
        
      },
      totalItems(){
        return this.internalValue.content.length
      },
      totalPages(){
        return Math.floor(this.totalItems/this.pageSize)
      },
      pageText(){
        return `Page ${this.index+1} of ${this.totalPages+1}`
      }
    },
    methods: {
      getIndex(i){
        return this.pageSize*this.index+i
      },
      onUpdate(e) {
        this.internalValue.content[e.index] = e.content
        this.$emit('changed', this.internalValue.content)
      },
      page(indexChange){
        //todo check for impossible states
        this.index +=indexChange
        if(this.index<0) this.index=this.totalPages;
        else if(this.index>this.totalPages)this.index=0
      }
    },
    watch: {
      filter: {
        handler(newVal) {
          this.internalFilter = newVal
        }
      },
      searchInput: {
        handler(newVal) {
          this.internalSearch = newVal
        }
      },
      jsonContent: {
        handler(newVal) {
  
          this.internalValue = newVal
          if (!newVal.content) { this.$emit('error', CEErrors.NoContent); return; }
          if (!Array.isArray(newVal.content)) { this.$emit('error', CEErrors.ContentNotArray); return; }
          if (Object.keys(newVal.content[0])[0] === 'id' && Object.keys(newVal.content[0]).length === 1) { this.$emit('error', CEErrors.OnlyIdContent); return; }
          this.internalValue = newVal
        },
        immediate: true
      },
      pageContent() {
        this.$forceUpdate()
      },
    }
  
  }
  </script>
  <style scoped>
  .customEditor{
    min-width: 100%;
  }
  .container {
    min-width: 40%;
    max-width: 100px;
  }
  </style>