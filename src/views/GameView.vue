<template lang="pug">
v-row(style="max-height:90vh;min-height:90vh").overflow-y-auto.overflow-x-hidden
  CustomDialog
  v-col.col-8
    v-row
      v-col.col-4.ma-2
        v-card.mb-3
          v-row.d-flex.justify-center.ma-4
            v-icon(@click="toFileViewer(game.id,'',true)").mt-5(style="transform:scale(2)") mdi-folder
          v-divider
          v-row.ma-4
            span.text-caption Browse and Edit all the Files of the Game.
      v-col.col-4.ma-2(
        v-for="audioReplacer in audioReplacerList"
        v-if="game?.content?.audioReplacer"
      )
        v-card.mb-3
          v-row.d-flex.justify-center.ma-4
            v-icon(@click="onAudioReplacer(audioReplacer)").mt-5(style="transform:scale(2)") mdi-music-circle-outline
          v-divider
          v-row.ma-4
            span.text-caption {{ audioReplacer.hint }}
            v-row
    v-divider
    span.ma-3 Custom Features [{{ isMod ? 'Mod':'Original Game' }}]
    v-row
      div.ma-6(v-if="(fastFolders.length + fastPrompts.length + audioReplacEditor.length)  === 0")
        span.font-italic ~This game currently does not feature any fast acess menu points, it will be implemented later you can open an Issue explaining why you want a specific gameview now.
        v-divider.my-3
        v-btn(color="primary").mt-4(@click="requestMenu()") Open Issue
      v-col(v-for="folder in fastFolders").col-3.ma-2      
        v-card.mb-3
          v-row.d-flex.justify-center.ma-4
            v-icon(@click="onFastAcessClick(folder)").mt-5(style="transform:scale(2)") {{ folder.isFolder ? 'mdi-folder' : 'mdi-file-document' }}
          v-divider
          v-row.ma-4
            span.text-caption {{folder.name}}

      v-col(v-for="prompt in fastPrompts").col-3.ma-2      
        v-card().mb-3
          v-row.d-flex.justify-center.ma-4
            v-icon(@click="onFastPrompts(prompt)").mt-5(style="transform:scale(2)") mdi-message-text-fast-outline
          v-divider
          v-row.ma-4
            span.text-caption {{prompt.name}}

      v-col(v-for="prompt in audioReplacEditor").col-3.ma-2      
        v-card().mb-3
          v-row.d-flex.justify-center.ma-4
            v-icon(@click="onAudioReplaceEditor(prompt)").mt-5(style="transform:scale(2)") mdi-file-music
          v-divider
          v-row.ma-4
            span.text-caption {{prompt.name}}


  v-col.col-4
    v-card.pa-4
      v-card
        v-img(:src="require(`@/assets/images/games/${key}.webp`)").mb-4
      v-row
        v-tooltip(left)
          template(v-slot:activator="{on, attrs}")
            v-progress-linear(
              v-model="modabilityScore"
              height=25
              v-bind="attrs"
              v-on="on"
              width=15
              style="pointer-events:none"
            )
              template(v-slot:default="{value}")
                strong {{ Math.ceil(value) }}%
          span Shows how much of the core game you can Modify. 100% means you can change everything and create a fully new game out of it.
      v-row(
        v-for="mod in MOD"
        v-if="hasMod(mod)"
      )
        v-icon {{ getModIcon(mod.id) }}
        span {{ mod.text}}
  
  
  
        
  </template>
    
<script>
import { GameIds, Mod } from '@/assets/data/JackBoxTreeData'
import { SETTING } from '@/assets/data/SettingData'
import { EditorMode } from '@/assets/data/Editor'
import { Code } from '@/assets/data/BusCode'
import dialog from '@/components/dialog'
import CustomDialog from '@/components/CustomDialog.vue'
const emptyOGG = require('@/assets/audioFile/empty.ogg')
export default {
  name: 'HomeView',
  components: {
    CustomDialog
  },
  data() {
    return {
      key: null,
      game: {},
      isMod:false
    }
  },
  computed: {
    audioReplacerList() {
      return (this.game?.content?.audioReplacer) ?? []
    },
    audioReplacEditor(){
      return (this.game?.content?.audioReplaceEditor) ?? []
    },
    fastFolders() {
      return (this.game?.content?.fastFolders) ?? []
    },
    fastPrompts() {
      return (this.game?.content?.fastPrompts) ?? []
    },
    modabilityScore() {
      return (this.game?.content?.modability?.score) ?? 'Not tested.'
    },
    gamePath(){
      if(this.isMod) return this.mod.path
      return `${(this.steamPath)}\\${this.game.id}`
    }
  },
  methods: {
    requestMenu(){
      window.file.openGithubIssue(this.game.name,
      "### Custom Gameview -"+this.game.name+"\n- XX \n- XX \n\n These features would greatly help make this mod tool better\nSincere  [My Name]"
      )
    },
    onAudioReplaceEditor(editor){
      //todo check if mod then use mod path

      this.$router.pass('Editor', {
          key: [this.steamPath,this.game.id,editor.audioFolder].join('\\'),
          editor: EditorMode.AudioPromptEditor,
          editorValues:{
            ...editor,
            id:this.game.id
          }
      })
    },
    async onAudioReplacer(ar) {
      this.answer = await dialog
            .title('Export Mod')
            .cancelText('Close')
            .okText('Yes remove all narations.')
            .html()
            .confirm(ar.hint)

      if(this.answer === false) return
      let folder = [this.gamePath, ar.path].join('\\')

      window.file.openExpandFolder(folder).then(x => {
        x = x.filter(path => path.includes(ar.originalFilename))
        x.forEach(audioFile => {
          window.file.replaceFileWithBase64(audioFile, emptyOGG, (err) => {
          })
        })

      })
    },
    hasMod(mod){
      if (this.game && this.game.content && this.game.content.modability) {
        return  this.game.content.modability.content.includes(mod.id)
      }
      return false
    },
    getModIcon(mod) {
      if (this.game && this.game.content && this.game.content.modability) {
        return (this.game.content.modability.content.includes(mod) ? 'mdi-checkbox-outline' : 'mdi-checkbox-blank-outline')
      }
      return 'mdi-checkbox-blank-outline'
    },
    toFileViewer(game,path, sendBackTo) {
      let gamePath = [game,path].join('\\')
      if (sendBackTo) {
        this.$broadcast(Code.SetCustomPathBackTo, {
          name: gamePath.split('\\').slice(-1)[0],
          key: this.key
        })
      }


      this.$router.pass('fileviewer', {
        key: [this.gamePath, path].join('\\')
      })
    },
    onFastAcessClick(folder) {
      if (folder.isFolder) {
        //fileviewer

        this.toFileViewer(this.game.id,folder.path)
      } else {
        //monaco editor
        this.$router.pass('Editor', { 
          key: [this.gamePath, folder.path].join('\\'),
          editor: folder.editorMode,
          editorValues: folder.editorValues
          
        })
      }
    },
    onFastPrompts(prompt){
      let filePath= [this.gamePath, prompt.path].join('\\')

      this.$router.pass('Editor', { 
        key: filePath,
        editor: EditorMode.FastPromptEditor,
        editorValues:{
          //add all the custom data any editor needs 
          key:prompt.key
        }
      })

    }
  },
  watch: {
    "$route.params.key": {
      handler(newVal) {
        if (!newVal) return
        if (newVal === "settings") return
        this.key = this.$route.params.key
        this.game = GameIds[this.key]
        this.game.isMod = this.isMod
      },
      immediate: true
    },
    "$route.params.isMod": {
      handler(newVal) {
        this.isMod = this.$route.params.isMod
        this.mod = this.$route.params.mod
        this.game.isMod = this.isMod
      },
      immediate: true
    }
  },
  created() {
    this.MOD = Mod
    this.steamPath = window.file.getSetting(SETTING.STEAM_PATH)
    this.modPath = window.file.getSetting(SETTING.MODS_PATH)

  }
}
</script>
    
  
<style>
.tooltip-inner {
  max-width: 60px !important;
  width: 60px !important;
}

.container {
  min-width: 23%;
  max-width: 250px;
}
</style>