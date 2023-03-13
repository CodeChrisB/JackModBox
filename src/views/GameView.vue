<template lang="pug">
v-row
  v-col.col-8
    v-card
      v-btn(@click="toFileViewer(game.id)") Open File Viewer
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
import { GameIds,Mod } from '@/assets/data/JackBoxTreeData'
import { SETTING } from '@/assets/data/SettingData'

export default {
  name: 'HomeView',
  components: {
    HelloWorld
  },
  data(){
    return {
      key:null,
      game:{}
    }
  },
  computed:{
    modabilityScore(){
      return (this.game?.content?.modability?.score) ?? 0
    }
  },
  methods:{
    getModIcon(mod){
      if(this.game && this.game.content && this.game.content.modability) {
        return (this.game.content.modability.content.includes(mod) ? 'mdi-checkbox-outline' : 'mdi-checkbox-blank-outline')
      }
      return 'mdi-checkbox-blank-outline'
    },
    toFileViewer(e){
      console.log(e)
      console.log('route0',[this.steamPath,e].join('\\'))
      this.$router.pass('fileviewer', {
        key: [this.steamPath,e].join('\\')
      })
    }
  },
  watch: {
    "$route.params.key": {
      handler(newVal) {
        if(!newVal)return
        this.key = this.$route.params.key
        this.game = Object.assign({}, this.game, GameIds[this.key])
      },
      immediate: true
    }
  },
  created(){
    this.MOD = Mod
    this.steamPath = window.file.getSetting(SETTING.STEAM_PATH)
    console.log(this.steamPath)
  }
}
</script>
  

<style>
.tooltip .tooltip-inner{
  max-width: 100px !important;
  width: 100px !important;
}
</style>