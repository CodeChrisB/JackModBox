<template lang="pug">
v-row
  v-col.col-8
    v-card.ma-1
      v-row
        v-col.col-4.ma-2
          v-card.mb-3
            v-row.d-flex.justify-center.ma-4
              v-icon(@click="toFileViewer(game.id)").mt-5(style="transform:scale(2)") mdi-folder
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
      span(v-if="fastFolders.length>0").ma-3 Fast Acess
      v-row
        v-col.col-2.ma-2(
          v-for="folder in fastFolders"
        )
          v-card.mb-3
            v-row.d-flex.justify-center.ma-4
              v-icon(@click="onFastAcessClick(folder)").mt-5(style="transform:scale(2)") {{ folder.isFolder ? 'mdi-folder' : 'mdi-file-document' }}
            v-divider
            v-row.ma-4
              span.text-caption {{folder.name}}

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
      v-row(v-for="mod in MOD")
        v-icon {{ getModIcon(mod.id) }}
        span {{ mod.text }}



      
</template>
  
<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'
import { GameIds, Mod } from '@/assets/data/JackBoxTreeData'
import { SETTING } from '@/assets/data/SettingData'
const  emptyOGG  =require('@/assets/audioFile/empty.ogg')
export default {
  name: 'HomeView',
  components: {
    HelloWorld
  },
  data() {
    return {
      key: null,
      game: {}
    }
  },
  computed: {
    audioReplacerList(){
      return (this.game?.content?.audioReplacer) ?? []
    },
    fastFolders(){
      return (this.game?.content?.fastFolders) ?? []
    },
    modabilityScore() {
      return (this.game?.content?.modability?.score) ?? 0
    }
  },
  methods: {
    onAudioReplacer(ar){
      let folder = [this.gamePath,ar.path].join('\\')

      window.file.openExpandFolder(folder).then(x=>{
        x = x.filter(path=>path.includes(ar.originalFilename))
        x.forEach(audioFile=>{
          window.file.replaceFileWithBase64(audioFile,emptyOGG,(err)=>{
          })  
        })

      })
    },  
    getModIcon(mod) {
      if (this.game && this.game.content && this.game.content.modability) {
        return (this.game.content.modability.content.includes(mod) ? 'mdi-checkbox-outline' : 'mdi-checkbox-blank-outline')
      }
      return 'mdi-checkbox-blank-outline'
    },
    toFileViewer(e) {
      console.log(this.steamPath)
      console.log(e)
      this.$router.pass('fileviewer', {
        key: [this.steamPath, e].join('')
      })
    },
    onFastAcessClick(folder){
      if(folder.isFolder){
        //fileviewer
        this.toFileViewer([this.game.id,folder.path].join('\\'))
      }else {
        //monaco editor
        this.$router.pass('MonacoEditor', { key: [this.steamPath,folder.path].join('\\') })
      }
    }
  },
  watch: {
    "$route.params.key": {
      handler(newVal) {
        if (!newVal) return
        if(newVal === "settings") return
        this.key = this.$route.params.key
        this.game = GameIds[this.key]
      },
      immediate: true
    }
  },
  created() {
    this.MOD = Mod
    this.steamPath = window.file.getSetting(SETTING.STEAM_PATH)
    this.gamePath = [this.steamPath,this.game.id].join("\\")
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