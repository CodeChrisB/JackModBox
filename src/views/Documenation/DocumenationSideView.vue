<template lang="pug">
  div
    v-row.ma-2.ml-6(v-for='doc in Documenation')
      v-btn(
        block
        text
        @click="broadcast(doc)" 
        )
        div.text-left {{ doc.title }}
        v-spacer
  </template>
<script>
import { Documenation } from '@/assets/data/DocumenationData';
import { Code } from '@/assets/data/BusCode';
export default {
  name: 'DocumenationSideView',
  data() {
    return {
    }
  },
  created(){
    this.Documenation = Documenation
  },
  methods: {
    broadcast(doc){
      this.$broadcast(Code.UpdateDocumentationData,doc.filename)
    }
  }
}
</script>
    