<template lang="pug">
div(style="max-height:90vh;min-height:90vh").view.ma-2.overflow-x-hidden
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

  v-row().overflow-auto
  v-divider 
  v-row.mt-3.pr-3.ml-2
    v-card.mb-3.ma-1(
      v-for="(fileContent,index) in pageContent"
      @click="onFileClick(fileContent)"
      @contextmenu="show($event,fileContent)"
      :style="viewMode[viewIndex].rule"
    )
      div(v-if="fileType(fileContent) === State.IMAGE")
        viewer-image(
          :path="fileContent.fullPath"
          :index="index"
          :indexToReload="indexToReload"
          :viewMode="viewMode[viewIndex].rule"
          @massReplace="onMassReplace($event,index)"
          )
        span {{ fileContent.name }}
      div(v-else-if="fileType(fileContent) === State.AUDIO")
        file-viewer-audio-player(
          :icon-scale="viewMode[viewIndex].scale",
          :file-name="fileContent.name"
          :path="fileContent.fullPath"
        )

      div(v-else)
        v-row.d-flex.justify-center.ma-4
          v-icon( :style="genTransformScale(viewMode[viewIndex].scale)") {{fileContent.isFolder=== 1 ?  'mdi-folder': 'mdi-file-document-outline'}}
        v-row.d-flex.justify-center.ma-0
          span.text-truncate.text-caption(style="word-break: break-word") {{fileContent.name}}

    v-menu(v-model="showMenu" :position-x="position.x" :position-y="position.y" absolute offset-y)
      v-list

        v-list-item(
          v-for="prop in menu"
          v-if="prop.visible.includes(fileType(clickedFile)) || prop.visible[0] === State.ALLFILES"
          @click="prop.func(clickedFile)"
        )
          span {{ prop.title }}

  v-dialog(v-model='dialog.open' width='auto')
    v-card
      v-card-text.pa-0.ma-0.overflow-hidden
        audio-player-dialog(
          :data="dialog.data"
        )

      

</template>

<script>
const State = Object.freeze({
  FOLDER: 0,
  JSON: 1,
  IMAGE: 2,
  TEXTFILE: 3,
  SWF: 4,
  AUDIO: 5,
  ALLFILES: 6
})
const Dialog = Object.freeze({
  AudioViewer: 0
})
import { SETTING } from '@/assets/data/SettingData'
import { EditorMode } from '@/assets/data/Editor'
import ViewerImage from './ViewerImage.vue'
import FileViewerAudioPlayer from './FileViewerAudioPlayer.vue'
import AudioPlayerDialog from '../Dialogs/AudioPlayerDialog.vue'

export default {
  name: 'FileViewer',
  components: {
    ViewerImage,
    FileViewerAudioPlayer,
    AudioPlayerDialog
  },
  data() {
    return {
      clickedFile: {},
      dialog: {
        open: false,
        component: null,
        data: {}
      },
      files: [],
      index: 0,
      isWheeling: false,
      indexToReload:-1,
      menu: [
        {
          title: 'Open',
          func: (game) => this.onFileClick(game),
          visible: [State.JSON]
        },
        {
          title: 'Open Folder',
          func: (game) => this.onFileClick(game),
          visible: [State.FOLDER]
        },
        {
          title: 'Open Expand Folder',
          func: (folder) => {
            folder.expand = true
            this.onFileClick(folder)
          },
          visible: [State.FOLDER]
        },
        {
          title: 'Open In Explorer',
          func: (game) => {
            let arr = game.fullPath.split('\\')
            window.file.openInFileExplorer(arr.join('\\'))
          },
          visible: [State.ALLFILES]
        },

      ],
      pageSize: 25,
      position: {
        x: 0,
        y: 0
      },
      possiblePageSize: [4, 10, 25, 50, 100, 200, 500, 1000, 2000, 4000],
      showMenu: false,
      viewIndex: 3,
      viewMode: [
        {
          rule: 'min-width:100px;max-width:10%;',
          scale: 1.2
        },
        {
          rule: 'min-width:130px;max-width:15%',
          scale: 1.3
        },
        {
          rule: 'min-width:160px;max-width:23%',
          scale: 1.4
        },
        {
          rule: 'min-width:240px;max-width:30%',
          scale: 1.5

        },
        {
          rule: 'min-width:320px;max-width:48%',
          scale: 1.7
        },
      ]
    }
  },
  /*  min-width: 23%;
  max-width: 250px;*/
  computed: {
    pageContent() {
      return this.items.slice(
        this.pageSize * this.index,
        this.pageSize * (this.index + 1)
      )
    },
    items() {
      return this.files
    },
    totalItems() {
      return this.items.length
    },
    totalPages() {
      return Math.floor(this.totalItems / this.pageSize)
    },
    pageText() {
      if (this.totalItems === this.pageSize) return '1/1'
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
  mounted() {
    document.addEventListener("keydown", this.onKeyDown)
    document.addEventListener("wheel", this.onWheel)
  },
  beforeDestroy() {
    document.removeEventListener("keydown", this.onKeyDown)

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
    fileType(fileContent) {
      if (fileContent.isFolder === 1) return State.FOLDER
      if (['jet', 'json'].includes(fileContent.suffix)) return State.JSON
      if (['txt', 'html'].includes(fileContent.suffix)) return State.TEXTFILE
      if (['jpg', 'png'].includes(fileContent.suffix)) return State.IMAGE
      if (['swf'].includes(fileContent.suffix)) return State.SWF
      if (['ogg'].includes(fileContent.suffix)) return State.AUDIO
      return State.ALLFILES
    },
    genTransformScale(scale) {
      return `transform:scale(${scale})`
    },
    getEditorForFileType(state){
      if ([State.JSON,State.TEXTFILE].includes(state)) return EditorMode.MonacoEditor
      if ([State.SWF].includes(state)) return EditorMode.SWFEditor
    },
    loadFiles() {
      if (this.expand) {
        window.file.openExpandFolder(this.folderPath).then(files => {
          let id = 0
          files = files.map(x => {
            id++
            return {
              name: x.split('\\').slice(-1)[0],
              isFolder: this.file.isFolder(x),
              suffix: x.split('.').slice(-1)[0],
              fullPath: x,
              id: id,
            }
          }).sort(({ isFolder: a }, { isFolder: b }) => b - a)
          this.files = files
          this.onRecalculatePageSize()
        })
      } else {
        window.file.fs.readdir(this.folderPath, (error, files) => {
          let id = 0
          files = files.map(x => {
            id++
            return {
              name: x,
              isFolder: this.file.isFolder([this.folderPath, x].join('\\')),
              suffix: x.split('.').slice(-1)[0],
              fullPath: [this.folderPath, x].join('\\'),
              id: id,
            }
          }
          ).sort(({ isFolder: a }, { isFolder: b }) => b - a)
          this.files = files
          this.onRecalculatePageSize()
        })
      }
    },
    onRecalculatePageSize() {
      this.pageSize = Math.min(this.files.length, 32)
    },
    onFileClick(e) {
      if (e.isFolder === 1) {
        this.clickedFile = this.folderPath + "\\" + e.name
        this.$router.pass('fileviewer', {
          expand: e.expand,
          key: this.clickedFile
        })
        return
      }
      let fileType = this.fileType(e)

      if (State.AUDIO === fileType) {
        this.dialog.open = true
        this.dialog.component = Dialog.AudioViewer
        this.dialog.data = e
        return
      }
        
      let editorForFile = this.getEditorForFileType(fileType)
      this.clickedFile = this.folderPath + "\\" + e.name

      this.$router.pass('Editor', {
        key: this.clickedFile,
        editor: editorForFile
      })
      
      
    },
    onMassReplace(filesToReplace,index){
      let startIndex = this.pageSize*this.index+index
      for(let i =0;i<filesToReplace.length;i++){
          window.file.overwriteFile(this.files[startIndex+i].fullPath, filesToReplace[i]).then(()=>this.indexToReload=(startIndex+i))
      }
    },
    onKeyDown(e) {
      //checking for : ctrl | '+' key     & ctrl | 'mouse wheel up'
      if (e.ctrlKey && e.code === 'NumpadAdd') {
        this.viewIndexStep(1)
      } else if (e.ctrlKey && e.code === 'NumpadSubtract') {
        this.viewIndexStep(-1)
      }
    },
    onWheel(e) {
      if (!e.ctrlKey) return;

      if (!this.isWheeling) {
        this.isWheeling = true;

        if (e.deltaY < 0) {
          this.viewIndexStep(1)
        } else {
          this.viewIndexStep(-1)

        }
        setTimeout(() => { this.isWheeling = false; }, 250);
      }
    },
    show(e, file) {
      e.preventDefault();
      this.showMenu = false;
      this.position.x = e.clientX;
      this.position.y = e.clientY;
      this.clickedFile = file
      this.$nextTick(() => {
        this.showMenu = true;
      });
    },
    viewIndexStep(step) {
      if (step === 1) {
        if (this.viewIndex + 1 <= this.viewMode.length) this.viewIndex++
      } else if (step === -1) {
        if (this.viewIndex - 1 >= 0) this.viewIndex--
      }
    },
    page(indexChange) {
      this.index += indexChange
      if (this.index < 0) this.index = this.totalPages;
      else if (this.index > this.totalPages) this.index = 0
    },
  },
  watch: {
    "$route.params.key": {
      handler(newVal) {
        if (!newVal) return
        this.folderPath = newVal
        this.$nextTick(() => {
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
  display: none !important;
  ;
}
</style>