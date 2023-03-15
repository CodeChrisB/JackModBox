<template lang="pug">
v-row
  v-col.col-8
    v-card
      v-btn(@click="toFileViewer(game.id)") Open File Viewer

      v-row(v-if="game.content.audioReplacer")
        v-col.col-4.ma-2(v-for="audioReplacer in game.content.audioReplacer")
          v-card.mb-3(
          )
            v-row.d-flex.justify-center.ma-4
              v-icon(@click="onAudioReplacer(audioReplacer)").mt-5(style="transform:scale(2)") mdi-music-circle-outline
            v-divider
            v-row.ma-4
              span.text-caption {{ audioReplacer.hint }}
      div
        v-divider
        span {{ game.content }}
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
    modabilityScore() {
      return (this.game?.content?.modability?.score) ?? 0
    }
  },
  methods: {
    onAudioReplacer(ar){
      console.log(emptyOGG)
      let folder = [this.gamePath,ar.path].join('\\')

      window.file.openExpandFolder(folder).then(x=>{
        x = x.filter(path=>path.includes(ar.originalFilename))
        x.forEach(audioFile=>{
          console.log('Overwriting '+audioFile)
          window.file.replaceFileWithBase64(audioFile,emptyOGG,(err)=>{
            console.log(err)
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
      console.log(e)
      console.log('route0', [this.steamPath, e].join('\\'))
      this.$router.pass('fileviewer', {
        key: [this.steamPath, e].join('\\')
      })
    }
  },
  watch: {
    "$route.params.key": {
      handler(newVal) {
        if (!newVal) return
        this.key = this.$route.params.key
        this.game = Object.assign({}, this.game, GameIds[this.key])
      },
      immediate: true
    }
  },
  created() {
    this.MOD = Mod
    this.steamPath = window.file.getSetting(SETTING.STEAM_PATH)
    this.gamePath = [this.steamPath,this.game.id].join("\\")
    console.log(this.steamPath)
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