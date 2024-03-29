<template lang="pug">
div
  v-row.ma-0
    pagination(
      :allItems="files"
      @update:shownItems="pageContent=$event"
      @update:pages-size="pageSize=$event"
    )

  v-divider  
  v-row(style="max-height:85vh").overflow-y-auto.mt-3.pr-3.ml-2
    v-card().mb-3.ma-1(
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
          :viewMode="viewMode[viewIndex].scale"
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

    v-menu(
      v-model='showMenu'
      :position-x='position.x' 
      :position-y='position.y' 
      absolute='' offset-y=''
      :close-on-content-click="false"
      )
      v-list
        v-list-item(
          v-for='prop in computedMenu' 
          v-if='(prop.visible.includes(fileType(clickedFile)) || prop.visible[0] === State.ALLFILES) && (!prop.hasContentProp ||clickedFileContent.content)' 
          @click='prop.func(clickedFile,prop,$event)'
        )
          v-icon(v-if="prop.icon") {{ prop.icon }}
          v-icon(v-else) {{ prop.isMenu ? 'mdi-arrow-right-bottom' : 'mdi-cursor-default-click-outline'}}
          span {{ prop.title }}

    div(min-height="5vh")

  v-dialog(v-model='dialog.open' width='auto')
    v-card
      v-card-text.pa-0.ma-0.overflow-hidden
        audio-player-dialog(
          :data="dialog.data"
        )
  CustomDialog
  
        
  
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
import Pagination from '@/components/tools/Pagination.vue'
import { SETTING } from '@/assets/data/SettingData'
import { EditorMode } from '@/assets/data/Editor'
import ViewerImage from './ViewerImage.vue'
import FileViewerAudioPlayer from './FileViewerAudioPlayer.vue'
import AudioPlayerDialog from '../Dialogs/AudioPlayerDialog.vue'
import CustomDialog from '@/components/CustomDialog.vue'
import dialog from '@/components/dialog'

export default {
  name: 'FileViewer',
  components: {
    ViewerImage,
    FileViewerAudioPlayer,
    AudioPlayerDialog,
    CustomDialog,
    Pagination
  },
  data() {
    return {
      pageContent:[],
      clickedFile: {},
      clickedFileContent: {},
      dialog: {
        open: false,
        component: null,
        data: {}
      },
      files: [],
      index: 0,
      isWheeling: false,
      indexToReload: -1,
      menu: [
        {
          title: 'Open',
          func: (game) => {
            this.onFileClick(game)
            this.showMenu = false

          },
          visible: [State.JSON]
        },
        {
          icon: 'mdi-folder-arrow-up-outline',
          title: 'Open Folder',
          func: (game) => {
            this.onFileClick(game)
            this.showMenu = false

          },
          visible: [State.FOLDER]
        },
        {
          title: 'Open Expand Folder',
          func: (folder) => {
            folder.expand = true
            this.onFileClick(folder)
            this.showMenu = false

          },
          visible: [State.FOLDER]
        },
        {
          title: 'Open In Explorer',
          func: (game) => {
            window.file.openInFileExplorer(game.fullPath)
            this.showMenu = false
          },
          visible: [State.ALLFILES]
        },
        {
          title: 'Open Editor',
          isMenu: true,
          func: (game, prop, e) => {
            this.useSubMenu = true
            this.subMenu = prop.menu
            this.$forceUpdate()
          },
          visible: [State.JSON, State.TEXTFILE],
          menu: [
            {
              icon: 'mdi-code-array',
              editor: EditorMode.MonacoEditor,
              title: 'Code Editor',
              visible: [State.JSON, State.TEXTFILE],
              func: () => {
                this.$router.pass('Editor', {
                  key: this.folderPath + "\\" + this.clickedFile.name,
                  editor: EditorMode.MonacoEditor
                })
              }
            },
            {
              icon: 'mdi-form-select',
              editor: EditorMode.CustomEditor,
              title: 'Card Editor',
              visible: [State.JSON],
              hasContentProp: true,
              func: () => {
                this.$router.pass('Editor', {
                  key: this.folderPath + "\\" + this.clickedFile.name,
                  editor: EditorMode.CustomEditor
                })
              }
            },
            {
              icon: 'mdi-message-text-fast',
              editor: EditorMode.FastPromptEditor,
              title: 'Fast Editor',
              visible: [State.JSON],
              hasContentProp: true,
              func: async () => {
                //get the key of the file
                let keys = []
                let fileContent = this.clickedFileContent
                fileContent = fileContent.content[0]
                keys = Object.keys(fileContent)
                //Open a dialog to ask the user what fast editor key to use
                this.answer = await dialog
                  .title('Fast Editor Key')
                  .selectContent(keys)
                  .cancelText('Close')
                  .okText('Use Key')
                  .html()
                  .label("Mod Name")
                  .prompt('Pick a Key')
                this.$router.pass('Editor', {
                  key: this.folderPath + "\\" + this.clickedFile.name,
                  editor: EditorMode.FastPromptEditor,
                  editorValues: { key: this.answer }
                })
              }
            },

          ]
        }

      ],
      pageSize: 25,
      position: {
        x: 0,
        y: 0
      },
      showMenu: false,
      subMenu: [],
      useSubMenu: false,
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
    computedMenu() {
      return this.useSubMenu ? this.subMenu : this.menu
    },
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
    getEditorForFileType(state) {
      if ([State.JSON, State.TEXTFILE].includes(state)) return EditorMode.MonacoEditor
      if ([State.SWF].includes(state)) return EditorMode.SWFEditor
    },
    getFileContent(){
      let path=this.folderPath + "\\" + this.clickedFile.name
      this.clickedFileContent = window.file.fs.readFileSync(path)
      this.clickedFileContent = new TextDecoder().decode(this.clickedFileContent)
      this.clickedFileContent = JSON.parse(this.clickedFileContent)
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
        })
      }
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
    onMassReplace(filesToReplace, index) {
      let startIndex = this.pageSize * this.index + index
      for (let i = 0; i < filesToReplace.length; i++) {
        window.file.overwriteFile(this.files[startIndex + i].fullPath, filesToReplace[i]).then(() => this.indexToReload = (startIndex + i))
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
      this.position.x = e.clientX;
      this.position.y = e.clientY;
      this.clickedFile = file

      if(this.clickedFile.name.endsWith('.jet')){
        this.getFileContent()
      }else{
        this.clickedFileContent=null
      }

      this.$nextTick(() => {
        this.useSubMenu = false,
        this.showMenu = true;
      })



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
}
</style>