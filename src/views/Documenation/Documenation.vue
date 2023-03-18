<template lang="pug">
div
  <div v-html="markdownToHtml"></div>
  v-divider


</template>
  
<script>
import { marked } from "marked";
import Welcome from '@/assets/documentation/docs/Welcome.md'
export default {
  name: 'DocumenationView',
  components: {
  
  },
  data() {
    return {
      markdown: ''
    }
  },
  computed:{
    markdownToHtml(){
      return marked(this.markdown);
    }
  },
  created() {
    this.markdown=Welcome
    let self=this
    this.$listen('documentation-data',self.changeDocumentation)

  },
  methods: {
    
    changeDocumentation(filename) {
      this.markdown = require(`@/assets/documentation/docs/${filename}`).default
      if(!this.markdown){
        this.markdown = `Loading this requested file was not possible.

        Try to
        1. Reload the file.
        2. Reopen the software
        3. Reinstall or download the software again.
        `
      }
      console.log(this.markdown)
    }
  }
}
</script>
  