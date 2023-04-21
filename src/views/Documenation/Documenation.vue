<template lang="pug">
div(style="overflow: auto;max-height:calc(100vh - 26px);max-width:80vw").view.ma-4.mr-6.mb-6
  div(v-for="(line,index) in markdown").pl-3
    span(v-if="line.startsWith('#')" :class="genHeaderClass(line)") {{ replaceLeadingHashes(line) }}
    span(v-else-if="line.startsWith('~~ ')").font-italic {{ line.slice(2) }}
    div(v-else-if="regexLine(line,'img',false)")
      v-img(
        :width="getImageDimension(line,'w')"
        :height="getImageDimension(line,'h')"
        :src="require('@/assets/docs/images/'+regexLine(line,'img',true).value)"
      )
      span {{ regexLine(line,'img',true).value }}
    div(v-else-if="line.startsWith('---')")
      v-divider
    div(v-else-if="isEmpty(line)")
      div(style="min-height:24px")
    div(v-else-if="line.startsWith('||')")
      div(style="min-height:12px")
    div(v-else-if="regexLine(line,'icon',false)")
      v-icon(
        :color="regexLine(line,'icon',true).attribute.split(' ')[1]"
        ) {{ regexLine(line,'icon',true).attribute.split(' ')[0] }}
      span {{ regexLine(line,'icon',true).value }}
    div(v-else-if="regexLine(line,'a',false)")
      a(@click="openWebsite(regexLine(line,'a',true).attribute)") {{ regexLine(line,'a',true).value }}
    span(v-else) {{ line }} 
  div(style="min-height:29px")
</template>
  
<script>
import VueMarkdown from 'vue-markdown-render';
import Welcome from '@/assets/docs/docs/Welcome.md'
import { Code } from '@/assets/data/BusCode';
export default {
  name: 'DocumenationView',
  components: {
    VueMarkdown
  },
  data() {
    return {
      dialog: true,
      markdown: '',
      images: {}
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
    this.$listen(Code.UpdateDocumentationData, self.changeDocumentation)
    this.changeDocumentation('Welcome.md')
  },
  methods: {
    changeDocumentation(filename) {
      this.images = {}
      this.markdown = require(`@/assets/docs/docs/${filename}`).default.split('\n')
    },
    genHeaderClass(str) {
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
    getImageDimension(str, dim) {
      const dimension =str.match(/\[img\s+(\d+x\d+)\]/)[1]
      if (!dimension) return null
      return dimension.split('x')[dim === 'w' ? 0 : 1]
    },
    isEmpty(line) {
      return line === '\r'
    },
    isImage(str, index) {
      let is = str.startsWith('![img')

      if (is) {
        let image = str.match(/(?<=\().+?(?=\))/)
        if (!image) return this.images[index] = 'notFound.png'
        this.getImageBase64(image[0]).then(x => {
          this.$set(this.images, index, x)
          this.images[index] = x
        })
      }
      return is
    },
    regexLine(line, tag, returnObject) {
      if(!line.startsWith('[')) return false
      const regex =  new RegExp(`\\[${tag}\\s*([^\\]]+)\\]\\s*(.*)`)
      const match = line.match(regex);
      if (match) {
        if (returnObject) {
          return {
            line: match[0],
            attribute: match[1],
            value: match[2]
          };
        } else {
          return true;
        }
      } else {
        return false;
      }
    },
    openWebsite(url) {
      window.file.openInBrowser(url)
    },
    replaceLeadingHashes(str) {
      const firstNonHashIndex = str.indexOf(str.match(/[^#]/));
      return str.slice(firstNonHashIndex)
    },

  }
}
</script>
  
<style scoped>
.view::-webkit-scrollbar {
  display: none;
}
</style>