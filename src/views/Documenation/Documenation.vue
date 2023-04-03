<template lang="pug">
div(style="overflow: auto;max-height:calc(100vh - 26px)")
  div(v-for="(line,index) in markdown").ma-4
    span(v-if="line.startsWith('#')" :class="genHeaderClass(line)") {{ replaceLeadingHashes(line) }}
    div(v-else-if="isImage(line,index)")
        v-img(
          :width="getImageDimension(line,'w')"
          :height="getImageDimension(line,'h')"
          :src="imageData(index)"
        )
    div(v-else-if="line.startsWith('---')")
      v-divider
    span(v-else) {{ line }}
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
      markdown: '',
      images:{}
    }
  },
  computed: {
    imageData() {
      return (index) => {
        return this.images[index] || '';
      }
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
      this.images = {}
      this.markdown = require(`@/assets/docs/docs/${filename}`).default.split('\n')
    },
    genHeaderClass(str){
      const firstNonHashIndex = str.indexOf(str.match(/[^#]/));
      return `text-h${(firstNonHashIndex === -1) ? str.length : firstNonHashIndex}`
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
    getImageDimension(str,dim){
      const dimension = str.match(/(?<=!\[img\s)\d+x\d+(?=\])/)
      if(!dimension) return null
      return dimension[0].split('x')[dim ==='w'?0:1]
    },  
    isImage(str,index){
      let is= str.startsWith('![img')

      if(is){
        let image = str.match(/(?<=\().+?(?=\))/)
        if(!image) return this.images[index] = 'notFound.png'
        this.getImageBase64(image[0]).then(x=>{
          this.$set(this.images,index,x)
          this.images[index]=x
        })
      }
      return is
    },
    replaceLeadingHashes(str) {
      const firstNonHashIndex = str.indexOf(str.match(/[^#]/));
      return str.slice(firstNonHashIndex)
    }
  }
}
</script>
  
<style scoped>
</style>