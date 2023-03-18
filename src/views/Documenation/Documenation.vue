<template lang="pug">
div
  vue-markdown.ml-2(:source="this.markdown")
  
</template>
  
<script>
import VueMarkdown from 'vue-markdown-render';
import Welcome from '@/assets/documentation/docs/Welcome.md'
export default {
  name: 'DocumenationView',
  components:{
    VueMarkdown
  },
  data() {
    return {
      dialog: true,
      markdown: '#fuck'
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
    }
  }
}
</script>
  
<style></style>