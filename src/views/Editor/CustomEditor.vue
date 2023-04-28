<template lang="pug">
div
  v-row.ma-0
    pagination(
        :allItems="internalValue.content"
        @update:shownItems="pageContent=$event"
        @update:pages-size="pageSize=$event"
      )
    v-col.col-2.pa-0
  v-divider.mb-4
  v-row.yo(style="max-height:80vh;min-width:100%").ma-1.overflow-y-auto
      CustomField.container(
        v-for="(obj,i) in pageContent"
        :obj="obj"  
        :index="getIndex(i)"
        :filter="internalFilter"
        :searchInput="internalSearch"
        show-modded
        v-on:update="onUpdate"
      )
      div(style="min-height:70vh")
    
  
  </template>
      
  <script>
  import { CEErrors } from '@/assets/data/EditorValues'
  import { CCState } from '@/assets/data/CustomCheckBoxData'
  import CustomField from '@/components/Fields/CustomField.vue'
  import Pagination from '@/components/tools/Pagination.vue'
  export default {
    name: 'CustomEditor',
    components: {
      CustomField,
      Pagination
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
        pageSize:10,
        possiblePageSize: [4, 10, 25, 50, 100, 200, 500, 1000, 2000, 4000],
        index:0,
        pageContent:[]
      }
    },
    computed:{
      propsToSearch() {
        if (!this.internalFilter) return []
        return this.internalFilter.filter(elem => elem[Object.keys(elem)[0]] === CCState.ON)
          .map(elem => Object.keys(elem)[0])
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
          console.log('update filter ce',newVal)
          this.internalFilter = newVal
        },
        immediate:true
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