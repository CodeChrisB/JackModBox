<template lang="pug">
div(style="max-height:90vh").view.ma-2.overflow-x-hidden
  v-row().overflow-auto
    v-card.mb-3.container(
      
      v-for="(fileContent) in files"
      @click="onFileClick(fileContent)"
    )
      div(v-if="['jpg','png'].includes(fileContent.suffix)")
        ViewerImage(:path="fileContent.fullPath")
        span {{ fileContent.name }}
      div(v-else)
        v-row.d-flex.justify-center.ma-4
          v-icon(style="transform:scale(2)") {{fileContent.isFolder=== 1 ?  'mdi-folder': 'mdi-file-document-outline'}}
        v-row.d-flex.justify-center
          span.text-caption(style="word-break: break-word") {{fileContent.name}}
</template>

<script>

import { SETTING } from '@/assets/data/SettingData'
import ViewerImage from './ViewerImage.vue'
export default {
  name: 'FileViewer',
  components:{
    ViewerImage
  },  
  data() {
    return {
      files: [],
      images:{}
    }
  },

  created() {
    this.file = window.file
    this.SETTING = SETTING
    this.steamPath = this.file.getSetting(SETTING.STEAM_PATH)
    this.folderPath = this.$route.params.key

    this.loadFiles()
  },
  methods: {
    loadFiles() {
      window.file.fs.readdir(this.folderPath, (error, files) => {
        let id =0
        files = files.map(x => {
          id++
          return {
            name: x,
            isFolder: this.file.isFolder([this.folderPath, x].join('\\')),
            suffix:x.split('.').slice(-1)[0],
            fullPath:[this.folderPath,x].join('\\'),
            id:id,
          }
        }
        ).sort(({isFolder:a}, {isFolder:b}) =>b-a)
        this.files = files
      })
      this.onFinishedLoading()
    },
    async loadImageWhenReady(path) {
      return window.file.loadImage(path)
    },
    onFileClick(e) {
      if(e.isFolder === 1){
        this.clickedFile = this.folderPath + "\\" + e.name
        this.$router.pass('fileviewer',{key:this.clickedFile})
      }else{
        this.clickedFile = this.folderPath + "\\" + e.name
        this.$router.pass('MonacoEditor', { key: this.clickedFile })
      }
    },

    onFinishedLoading(){
      console.log('onFinishedLoading',this.files)
    }
  },
  watch: {
    "$route.params.key": {
      handler(newVal) {
        if (!newVal) return
        this.folderPath = newVal
        this.loadFiles()
      },
      immediate: true
    }
  },

}
</script>
<style scoped>
.container {
  min-width: 23%;
  max-width: 250px;
}
.view:-webkit-scrollbar {
  display: none!important;;
}
</style>