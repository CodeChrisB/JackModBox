<template lang="pug">
div(style="overflow: auto;max-height:calc(100vh - 26px)")
  vue-markdown.ml-2.imgContainer(:source="this.markdown")
</template>
  
<script>
import VueMarkdown from 'vue-markdown-render';
import Welcome from '@/assets/docs/docs/Welcome.md'
export default {
  name: 'DocumenationView',
  components: {
    VueMarkdown
  },
  data() {
    return {
      dialog: true,
      markdown: '#fuck'
    }
  },
  created() {
    this.markdown = Welcome
    let self = this
    this.$listen('documentation-data', self.changeDocumentation)
    this.changeDocumentation('Welcome.md')
  },
  methods: {
    changeDocumentation(filename) {
      this.markdown = require(`@/assets/docs/docs/${filename}`).default
      this.replaceImgTags(this.markdown)
      if (!this.markdown) {
        this.markdown = `Loading this requested file was not possible.

        Try to
        1. Reload the file.
        2. Reopen the software
        3. Reinstall or download the software again.
        `
      }
      console.log('finished')
    },
    async replaceImgTags(str) {
      const regex = /!\[img\]\((.*?)\)/g;
      const matches = str.match(regex);
      if (!matches) {
        return str;
      }
      const promises = matches.map(async (match) => {
        const content = match.slice(7, -1);
        const base64Image = await this.getImageBase64(content);
        return `![Alt text](${base64Image})`;
      });
      const replacements = await Promise.all(promises);
      for (let i = 0; i < replacements.length; i++) {
        str = str.replace(matches[i], replacements[i]);
      }
      this.markdown = str;
      return str;
    },
    async getImageBase64(filename) {
      const imagePath = require(`@/assets/docs/images/${filename}`);
      const imageBlob = await fetch(imagePath).then((response) => response.blob());
      const base64Image = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(imageBlob);
      });
      return base64Image
    },
  }
}
</script>
  
<style scoped>
.imgContainer >>> img {
  width: 100%!important;
  height: auto!important;
  /* Magic! */
  max-width: 50vw!important;
}
</style>