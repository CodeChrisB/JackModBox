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
  v-row.ma-3.mt-0.pa-3
    v-col.col-6.pa-2(v-for="audio in pageContent")      
      v-card.pa-2
        span {{audio}}.ogg
        v-text-field(
          v-model="textFieldValues[audio]"
          label="Audio Name"
        )
</template>
        
  <script>
import { SETTING } from '@/assets/data/SettingData'

  
  export default {
    name: 'FastPromptEditor', 
    data() {
      return {
        folder:[],
        internalValue: '',
        audioFolder:'',
        promptFile:{},
        textFieldValues:{},
        index:0,
        pageSize:8,
        possiblePageSize: [8, 16, 32, 64, 128, 256, 512, 1024, 2048, 4096],
      }
    },
    props: {
      data: {
        type: Object
      },
    },
    computed:{
      pageContent(){
        return this.folder.slice(
          this.pageSize*this.index,
          this.pageSize*(this.index+1)
        )
      },
      items() {
        return this.internalValue.content
      },
      totalItems(){
        return this.folder.length
      },
      totalPages(){
        return Math.floor(this.totalItems/this.pageSize)
      },
      pageText(){
        return `${ this.index+1}/${this.totalPages+1}`
      },
      pageShowingText(){
        let max = Math.min((this.index+1)*this.pageSize,this.totalItems)
        return `Showing Items ${this.index*this.pageSize+1} - ${max}`
      },
      pageSizeStates() {
        return [...this.possiblePageSize, this.totalItems].filter(x => x <= this.totalItems)
      }
    },
    created() {
      this.steamPath = window.file.getSetting(SETTING.STEAM_PATH)
      this.gamePath = this.steamPath+this.data.id
      this.audioFolder = [this.gamePath,this.data.audioFolder].join('\\')
      //read the audio folder
      window.file.fs.readdir(this.audioFolder, (error, files) => {this.folder = files.map(x=>x.split('.')[0])})
      //read the prompt json
      this.promptFilePath = [this.gamePath,this.data.dataFile].join('\\')
      window.file.fs.readFile(this.promptFilePath,(err,content)=>{
        console.log(err,content)
        this.promptFile = JSON.parse(new TextDecoder().decode(content))
        console.log(this.promptFile)
        for(const value in this.promptFile.content){
          this.$set(this.textFieldValues,this.promptFile.content[value].id,this.promptFile.content[value].name)

          //this.textFieldValues.content[value] = this.promptFile.content[value].name
        }

        console.log(this.textFieldValues)
      })
    },
    methods: {
      onUpdate(e) {

  
        
      },
    }
  }
  </script>
