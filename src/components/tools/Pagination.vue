<template lang="pug">
v-row(style="min-width:100%").py-3
  div.mt-2
    v-btn(:disabled="index === 0" icon @click="page(-1)") 
      | <
    span {{ pageText }} 
    v-btn(:disabled="index === totalPages-1 || totalPages ===1" icon @click="page(1)")
      | >
  v-select.mt-5(
    v-model="pageSize"
    dense
    label="PageSize"
    hide-details
    :items="pageSizeStates"
    @change="emitNewPage($event);$emit('update:pages-size',pageSize)"
    )
  v-spacer

  span.pt-3.pr-3 {{ pageShowingText }}

</template>
  
  <script>
  
  export default {
    name: 'FileViewer',

    data() {
      return {
        internalItems:[],
        pageSize: 25,
        index:0,
        possiblePageSize: [10, 25, 50, 100, 200, 500, 1000, 2000, 4000],
      } 
    },
    props:{
      allItems:{
        type:Array,
      }
    },  
    computed: {
      pageContent() {
        return this.items.slice(
          this.pageSize * this.index,
          this.pageSize * (this.index + 1)
        )
      },
      items() {
        return this.internalItems
      },
      totalItems() {
        return this.items.length
      },
      totalPages() {
        return Math.ceil(this.totalItems / this.pageSize)
      },
      pageText() {
        if (this.totalItems === this.pageSize) return '1/1'
        return `${this.index + 1}/${this.totalPages}`
      },
      pageShowingText() {
        let max = Math.min((this.index + 1) * this.pageSize, this.totalItems)
        return `Showing Items ${this.index * this.pageSize + 1} - ${max}`
      },
      pageSizeStates() {
        return [4,...this.possiblePageSize, this.totalItems].filter(x => x <= this.totalItems)
      }
    },
    created() {
    },
    methods: {
      page(indexChange) {
        this.index += indexChange
        if (this.index < 0) this.index = this.totalPages;
        else if (this.index > this.totalPages) this.index = 0
      },
      emitNewPage(){
        this.$nextTick(()=>{
          this.$emit('update:shownItems',this.pageContent)
        })
      }
    },
    watch: {
      "allItems": {
        handler(newVal) {
          if (!newVal) return
          this.internalItems = newVal
          this.pageSize = Math.min(25,this.possiblePageSize.slice(-1))
          this.emitNewPage()
        },
        immediate: true
      },  
    },
  
  }
  </script>
  <style scoped>
  </style>