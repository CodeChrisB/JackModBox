<template lang="pug">
div
  v-row.ma-0
    v-col.pa-0.pt-2.pl-3
      v-btn(icon @click="page(-1)") 
        | <
      span {{ pageText }}
      v-btn(icon @click="page(1)")
        | >
    v-col.pa-0
      v-select.mt-5(
        v-model="pageSize"
        dense
        label="PageSize"
        :items="[1,2,4,8,16,totalItems]"
        hide-details
      )
    v-spacer
    span.pt-3 {{ pageShowingText }}
    v-col.col-2.pa-0
  v-divider.mb-4
  v-row.yo(style="max-height:85vh;min-width:100%").overflow-y-auto
      CustomField.container(
        v-for="(obj,i) in pageContent"
        :obj="obj"  
        :index="getIndex(i)"
        :filter="internalFilter"
        :searchInput="internalSearch"
        show-modded
        v-on:update="onUpdate"
      )
    
  
  </template>
      
  <script>
  import { CEErrors } from '@/assets/data/EditorValues'
  import { CCState } from '@/assets/data/CustomCheckBoxData'
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
        return this.items.slice(
          this.pageSize*this.index,
          this.pageSize*(this.index+1)
        )
      },
      propsToSearch() {
        if (!this.internalFilter) return []
        return this.internalFilter.filter(elem => elem[Object.keys(elem)[0]] === CCState.ON)
          .map(elem => Object.keys(elem)[0])
      },
      items() {
       return this.internalValue.content
      },
      totalItems(){
        return this.items.length
      },
      totalPages(){
        return Math.floor(this.totalItems/this.pageSize)
      },
      pageText(){
        if(this.totalItems === this.pageSize) return '1/1'
        return `${ this.index+1}/${this.totalPages+1}`
      },
      pageShowingText(){
        let max = Math.min((this.index+1)*this.pageSize,this.totalItems)
        return `Showing Items ${this.index*this.pageSize+1} - ${max}`
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
    min-height:80vh
  }
  .container {
    min-width: 40%;
    max-width: 100px;
  }
  </style>