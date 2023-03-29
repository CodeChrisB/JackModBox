<template lang="pug">
div
  v-row.ma-0
    v-col.pa-0.pt-2.pl-3
      v-btn(:disabled="index === 0" icon @click="page(-1)") 
        | <
      span {{ pageText }}
      v-btn(:disabled="index === totalPages || totalPages ===1" icon @click="page(1)")
        | >
    v-col.pa-0
      v-select.mt-5(
        v-model="pageSize"
        dense
        label="PageSize"
        :items="pageSizeStates"
        hide-details
      )

    v-spacer

    span.pt-3.pr-3 {{ pageShowingText }}
  v-row(style="max-height:87vh").ma-3.mt-0.pa-3.overflow-y-auto
    v-col.col-6.pa-2(v-for="audio in pageContent")      
      v-card.pa-2
        file-viewer-audio-player(
            :icon-scale="1.5",
            :file-name="audio+'.ogg'"
            :path="fullpath(audio)"
          )
        v-text-field(
          v-model="textFieldValues[audio]"
          label="Audio Name"
        )
          template(v-slot:append)
            v-btn(
              @click="savePrompt(audio)"
              icon
            )
              v-icon mdi-content-save
          template(v-slot:append-outer)
            v-btn(
              @click="playAudio(audio)"
              icon
            )
              v-icon mdi-chevron-right-circle-outline 
</template>
        
<script>
import { SETTING } from '@/assets/data/SettingData'
import FileViewerAudioPlayer from '../FileViewer/FileViewerAudioPlayer.vue'

export default {
  name: 'AudioPromptEditor',
  components:{
    FileViewerAudioPlayer
  },
  data() {
    return {
      folder: [],
      internalValue: '',
      audioFolder: '',
      promptFile: {},
      textFieldValues: {},
      index: 0,
      pageSize: 10,
      possiblePageSize: [4, 10, 25, 50, 100, 200, 500, 1000, 2000, 4000],
    }
  },
  props: {
    data: {
      type: Object
    },
  },
  computed: {
    pageContent() {
      return this.folder.slice(
        this.pageSize * this.index,
        this.pageSize * (this.index + 1)
      )
    },
    items() {
      return this.internalValue.content
    },
    totalItems() {
      return this.folder.length
    },
    totalPages() {
      return Math.floor(this.totalItems / this.pageSize)
    },
    pageText() {
      return `${this.index + 1}/${this.totalPages + 1}`
    },
    pageShowingText() {
      let max = Math.min((this.index + 1) * this.pageSize, this.totalItems)
      return `Showing Items ${this.index * this.pageSize + 1} - ${max}`
    },
    pageSizeStates() {
      return [...this.possiblePageSize, this.totalItems].filter(x => x <= this.totalItems)
    }
  },
  created() {
    this.steamPath = window.file.getSetting(SETTING.STEAM_PATH)
    this.gamePath = this.steamPath + this.data.id
    this.audioFolder = [this.gamePath, this.data.audioFolder].join('\\')
    //read the audio folder
    window.file.fs.readdir(this.audioFolder, (error, files) => { this.folder = files.map(x => x.split('.')[0]) })
    //read the prompt json
    this.promptFilePath = [this.gamePath, this.data.dataFile].join('\\')
    console.log(this.promptFilePath)
    window.file.fs.readFile(this.promptFilePath, (err, content) => {
      console.log(err, content)
      this.promptFile = JSON.parse(new TextDecoder().decode(content))
      console.log(this.promptFile)
      for (const value in this.promptFile.content) {
        this.$set(this.textFieldValues, this.promptFile.content[value].id, this.promptFile.content[value].name)

        //this.textFieldValues.content[value] = this.promptFile.content[value].name
      }

      console.log(this.textFieldValues)
    })
  },
  methods: {
    fullpath(filename){
      return [this.audioFolder,filename+'.ogg'].join('\\')
    },  
    onUpdate(e) {

    },
    page(indexChange) {
      this.index += indexChange
      if (this.index < 0) this.index = this.totalPages;
      else if (this.index > this.totalPages) this.index = 0
    },
    playAudio(audio){
      window.file.playSound(this.fullpath(audio))
    },
    savePrompt(audio){
      console.log(this.promptFile)
      let index = this.promptFile.content.findIndex(x=>x.id === parseInt(audio))
      //this if should never catch
      if(!index || !this.textFieldValues[audio]) return
      //override the prompt values
      this.promptFile.content[index].name = this.textFieldValues[audio]
      this.promptFile.content[index].short = this.textFieldValues[audio]


      window.file.fs.writeFile(this.promptFilePath,JSON.stringify(this.promptFile,null,2),(err)=>{if(err){alert('Error while saving, please reload the page')}})
    }
  }
}
</script>
