<template lang="pug">
div
  v-row.ma-0.mr-4
    div.ml-2.mt-3
      v-btn(:disabled="index === 0" icon @click="page(-1)") 
        | <
      span {{ pageText }}
      v-btn(:disabled="index === totalPages || totalPages ===1" icon @click="page(1)")
        | >

    v-select.mt-5(
      v-model="pageSize"
      dense
      style="max-width:15vw"
      label="PageSize"
      :items="pageSizeStates"
      hide-details
    )
    v-checkbox(
      v-model="showUnused"
      label="Show Unused Prompts"
    )

    v-spacer
    span.pt-3.mr-6 {{ pageShowingText }}
  v-row(style="max-height:87vh").ma-3.mt-0.pa-3.overflow-y-auto
    v-col.col-6.pa-2(v-for="audio in pageContent")      
      v-card.pa-2
        v-row
          v-col.col-10
            span {{ audio }}
            file-viewer-audio-player(
                :icon-scale="1.5",
                :file-name="audio.id>100000 ? 'Not in the game' : audio.id+'.ogg'"
                :path="fullpath(audio.id)"
              )
          v-col.col-2
            v-row.ma-0
              v-spacer
              v-btn(
                @click="toggleRemovePrompt(audio.id)"
                icon
              )
                v-icon mdi-swap-vertical
        v-text-field(
          v-model="textFieldValues[audio.id]"
          label="Audio Name"
        )
          template(v-slot:append)
            v-btn(
              @click="savePrompt(audio.id)"
              icon
            )
              v-icon mdi-content-save
          template(v-slot:append-outer)
            v-btn(
              @click="playAudio(audio.id)"
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
      textFieldValues: {},
      index: 0,
      pageSize: 10,
      possiblePageSize: [4, 10, 25, 50, 100, 200, 500, 1000, 2000, 4000],
      promptFile:{
        content:[]
      },
      showUnused:false,
    }
  },
  props: {
    data: {
      type: Object
    },
  },
  computed: {
    pageContent() {
      //todo add filter for unused props
      return this.items.slice(
        this.pageSize * this.index,
        this.pageSize * (this.index + 1)
      )
    },
    items() {
      return this.promptFile.content.filter(x=>this.showUnused  ? x.id>100000 : x.id<100000)
    },
    totalItems() {
      return this.items.length
    },
    totalPages() {
      return Math.floor(this.totalItems / this.pageSize)
    },
    pageText() {
      return `${this.index + 1}/${this.totalPages + 1}`
    },
    pageShowingText() {
      let max = Math.min((this.index + 1) * this.pageSize, this.totalItems)
      return `Showing Items ${this.index * this.pageSize + 1} - ${max} of ${this.totalItems} items`
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
    window.file.fs.readdir(this.audioFolder, (error, files) => {this.folder = files.map(x => x.split('.')[0]) })

    //read the prompt json
    this.promptFilePath = [this.gamePath, this.data.dataFile].join('\\')
   
    window.file.fs.readFile(this.promptFilePath, (err, content) => {
      this.promptFile = JSON.parse(new TextDecoder().decode(content))
      for (const value in this.promptFile.content) {
        this.$set(this.textFieldValues, this.promptFile.content[value].id, this.promptFile.content[value].name)

        //this.textFieldValues.content[value] = this.promptFile.content[value].name
      }
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
      let index = this.promptFile.content.findIndex(x=>x.id === parseInt(audio))
      //this if should never catch
      if(index<0 || !this.textFieldValues[audio]) return
      //override the prompt values
      this.promptFile.content[index].name = this.textFieldValues[audio]
      this.promptFile.content[index].short = this.textFieldValues[audio]
      

      window.file.fs.writeFile(this.promptFilePath,JSON.stringify(this.promptFile,null,2),(err)=>{if(err){alert('Error while saving, please reload the page')}})
    },
    toggleRemovePrompt(audio){
      let index = this.promptFile.content.findIndex(x=>x.id === parseInt(audio))
      //this if should never catch
      if(index<0) return
      let idToChange = this.promptFile.content[index].id+""
      if(idToChange.length === 5){
        //add x
        this.$set(this.promptFile.content[index],'id',parseInt([this.promptFile.content[index].id,'000'].join('')))
      }else{
        //length of 8 is modded
        this.$set(this.promptFile.content[index],'id',parseInt(idToChange.slice(0,5)))
      }
      this.$forceUpdate()
      window.file.fs.writeFile(this.promptFilePath,JSON.stringify(this.promptFile,null,2),(err)=>{if(err){alert('Error while saving, please reload the page')}})
    },
  }
}
</script>
