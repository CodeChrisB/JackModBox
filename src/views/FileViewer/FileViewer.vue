<template lang="pug">
div(style="max-height:90vh;min-height:90vh").view.ma-2.overflow-x-hidden
  v-row.ma-0
    v-col.pa-0.pt-2.pl-3
      v-btn(icon @click="page(-1)") 
        | <
      span {{ pageText }}
      v-btn(icon @click="page(1)")
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

    span.pt-3 {{ pageShowingText }}

  v-row().overflow-auto
  v-divider 
  v-row.mt-3
    v-card.mb-3.container(
      v-for="(fileContent) in pageContent"
      @click="onFileClick(fileContent)"
      @contextmenu="show($event,fileContent)"
    )
      div(v-if="fileType(fileContent) === State.IMAGE")
        ViewerImage(:path="fileContent.fullPath")
        span {{ fileContent.name }}
      div(v-else)
        v-row.d-flex.justify-center.ma-4
          v-icon(style="transform:scale(2)") {{fileContent.isFolder=== 1 ?  'mdi-folder': 'mdi-file-document-outline'}}
        v-row.d-flex.justify-center
          span.text-caption(style="word-break: break-word") {{fileContent.name}}
          
    v-menu(v-model="showMenu" :position-x="position.x" :position-y="position.y" absolute offset-y)
      v-list
        
        v-list-item(
          v-for="prop in menu"
          v-if="prop.visible.includes(fileType(clickedFile)) || prop.visible[0] === State.ALLFILES"
          @click="prop.func(clickedFile)"
        )
          span {{ prop.title }}
</template>

<script>
const State = Object.freeze({
  FOLDER:0,
  JSON:1,
  IMAGE:2,
  TEXTFILE:3,
  SWF:4,
  ALLFILES:5
})
import { SETTING } from '@/assets/data/SettingData'
import { EditorMode } from '@/assets/data/Editor'
import ViewerImage from './ViewerImage.vue'
export default {
  name: 'FileViewer',
  components:{
    ViewerImage
  },  
  data() {
    return {
      clickedFile:{},
      index:0,
      pageSize:32,
      possiblePageSize:[8,16,32,64,128,256,512,1024,2048,4096],
      position:{
        x:0,
        y:0
      },
      menu:[
        {
          title:'Open',
          func: (game) => this.onFileClick(game),
          visible:[State.JSON]
        },
        {
          title:'Open Folder',
          func: (game) => this.onFileClick(game),
          visible:[State.FOLDER]
        },
        {
          title:'Open Expand Folder',
          func: (folder) => {
            folder.expand = true
            this.onFileClick(folder)
          },
          visible:[State.FOLDER]
        },
        {
          title:'Open In Explorer',
          func: (game) => {
            let arr = game.fullPath.split('\\')
            arr.pop()
            window.file.openInFileExplorer(arr.join('\\'))
          },
          visible:[State.ALLFILES]
        },

      ],
      
      files: [],
      images:{},
      showMenu:false
    }
  },
  computed:{
    pageContent(){
        return this.items.slice(
          this.pageSize*this.index,
          this.pageSize*(this.index+1)
        )
      },
      items() {
        return this.files
      },
      totalItems(){
        return this.items.length
      },
      totalPages(){
        return Math.floor(this.totalItems/this.pageSize)
      },
      pageText(){
        if(this.totalItems === this.pageSize) return '1/1'
        return `${ this.index+1}/${this.totalPages+1}`
      },
      pageShowingText(){
        let max = Math.min((this.index+1)*this.pageSize,this.totalItems)
        return `Showing Items ${this.index*this.pageSize+1} - ${max}`
      },
      pageSizeStates(){
        return [...this.possiblePageSize,this.totalItems].filter(x=>x<=this.totalItems)
      }
  },  
  created() {
    this.file = window.file
    this.SETTING = SETTING
    this.State = State
    this.steamPath = this.file.getSetting(SETTING.STEAM_PATH)
    this.folderPath = this.$route.params.key
    this.expand = this.$route.params.expand
    

    this.loadFiles()
  },
  methods: {
    fileType(fileContent){
      if(fileContent.isFolder === 1) return State.FOLDER
      if(['jet','json'].includes(fileContent.suffix)) return State.JSON
      if(['txt','html'].includes(fileContent.suffix)) return State.TEXTFILE
      if(['jpg','png'].includes(fileContent.suffix)) return State.IMAGE
      if(['swf'].includes(fileContent.suffix)) return State.SWF
      return State.ALLFILES
    },
    loadFiles() {
      if(this.expand){
        window.file.openExpandFolder(this.folderPath).then(files=>{
          let id =0
          files = files.map(x=>{
            id++
            return {
              name: x.split('\\').slice(-1)[0],
              isFolder: this.file.isFolder(x),
              suffix:x.split('.').slice(-1)[0],
              fullPath:x,
              id:id,
            }
          }).sort(({isFolder:a}, {isFolder:b}) =>b-a)
          this.files = files
          this.onRecalculatePageSize() 
        })
      }else{
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
        this.onRecalculatePageSize() 
      })
      }
    },
    onRecalculatePageSize(){
        this.pageSize = Math.min(this.files.length,32)
    },  
    onFileClick(e) {
      if(e.isFolder === 1){
        this.clickedFile = this.folderPath + "\\" + e.name
        this.$router.pass('fileviewer',{
          expand:e.expand,
          key:this.clickedFile
        })
      }else{
        this.clickedFile = this.folderPath + "\\" + e.name
        this.$router.pass('Editor', { 
          key: this.clickedFile,
          editor: EditorMode.MonacoEditor
        })
      }
    },
    show(e,file) {
    e.preventDefault();
      this.showMenu = false;
      this.position.x = e.clientX;
      this.position.y = e.clientY;
      this.clickedFile = file
      this.$nextTick(() => {
        this.showMenu = true;
      });
    },
    page(indexChange){
        this.index +=indexChange
        if(this.index<0) this.index=this.totalPages;
        else if(this.index>this.totalPages)this.index=0
    },
  },
  watch: {
    "$route.params.key": {
      handler(newVal) {
        if (!newVal) return
        this.folderPath = newVal
        this.$nextTick(()=>{
          this.loadFiles()
        })
      },
      immediate: true
    },
    "$route.params.expand": {
      handler(newVal) {
        this.expand = newVal
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