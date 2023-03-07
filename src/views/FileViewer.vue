<template lang="pug">
v-row.ma-2
  v-card.mb-3.container(
    v-for="(file,index) in files"
    @click="onFileClick(file)"
  )
    v-row.d-flex.justify-center.ma-4
      v-icon(style="transform:scale(2)") mdi-file-document-outline
    v-row.d-flex.justify-center
      span.text-caption(style="word-break: break-word") {{file}}
</template>

<script>

import { SETTING } from '@/assets/data/SettingData'
import { GameIds } from '@/assets/data/JackBoxTreeData'
export default {
  name: 'FileViewer',
  data() {
    return {
      files: []
    }
  },
  created(){ 
    this.file = window.file
    this.SETTING = SETTING
    this.steamPath = this.file.getSetting(SETTING.STEAM_PATH)
    this.key =this.$route.params.key
    this.object =GameIds[this.key]
    this.folderPath = this.steamPath+this.object.id

    this.loadFiles()
  },
  methods:{
    loadFiles(){
      this.file.fs.readdir(this.folderPath, (error, files) => {
        this.files = files
      })
    },
    onFileClick(e){
      this.clickedFile = this.folderPath+"\\"+e
      this.$router.pass('MonacoEditor',{key:this.clickedFile})
    }
  }

}
</script>
<style scoped>
.container{
  min-width: 23%;
  max-width: 250px;
}
</style>