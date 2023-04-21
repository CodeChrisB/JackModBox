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
      env:''
    }
  },
  created(){
    console.log(window.file.isDevelopment)
    this.env = window.file.node

    if(window.file.isDevelopment === false){
      this.Documenation = Documenation.filter(x=>!x.dev)
    } else{
      this.Documenation = Documenation

    }
  },
  methods: {
    broadcast(doc){
      this.$broadcast(Code.UpdateDocumentationData,doc.filename)
    }
  }
}
</script>
    