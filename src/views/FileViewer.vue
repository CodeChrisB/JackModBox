<template lang="pug">
div.ma-2
  v-row
    v-card.mb-3.container(
      v-for="(file) in files"
      @click="onFileClick(file)"
    )
      div(v-if="file.suffix === 'jpg'")
        v-img(:src="file.fullPath")
         span {{ file.fullPath }}
      div(v-else)
        v-row.d-flex.justify-center.ma-4
          v-icon(style="transform:scale(2)") {{file.isFolder=== 1 ?  'mdi-folder': 'mdi-file-document-outline'}}
        v-row.d-flex.justify-center
          span.text-caption(style="word-break: break-word") {{file.name}}
</template>

<script>

import { SETTING } from '@/assets/data/SettingData'
export default {
  name: 'FileViewer',
  data() {
    return {
      files: []
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
      this.file.fs.readdir(this.folderPath, (error, files) => {
        files = files.map(x => {
          return {
            name: x,
            isFolder: this.file.isFolder([this.folderPath, x].join('\\')),
            suffix:x.split('.').slice(-1)[0],
            fullPath:[this.folderPath,x].join('\\')
          }
        }
        ).sort(({isFolder:a}, {isFolder:b}) =>b-a)
        this.files = files
      })
    },
    onFileClick(e) {
      if(e.isFolder === 1){
        this.clickedFile = this.folderPath + "\\" + e.name
        this.$router.pass('fileviewer',{key:this.clickedFile})
      }else{
        this.clickedFile = this.folderPath + "\\" + e.name
        this.$router.pass('MonacoEditor', { key: this.clickedFile })
      }
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
</style>