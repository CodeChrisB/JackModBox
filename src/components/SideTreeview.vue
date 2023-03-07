<template lang="pug">
div
  div(v-for="(item,index) in items")
    v-row().mt-1
      span {{ item.name }}
      v-spacer
      v-icon(@click="toggle(index)") {{ panels[index] ? 'mdi-menu-up-outline' : 'mdi-menu-down-outline' }}
    v-col.panel(
      v-if="panels[index]"
      :style="panelHeight"
      )
        v-row().my-1(v-for="game in item.children")
          v-btn(@click="onClick(game)")
            span() {{ game.name }}
    v-divider.mt-4

</template> 

<script>
import { SETTING } from '@/assets/data/SettingData'
import  { JackBoxTreeData } from '@/assets/data/JackBoxTreeData'
export default {
  name: 'SettingsView',
  created() {
    this.file = window.file
    this.SETTING = SETTING
    this.steamPath = this.file.getSetting(SETTING.STEAM_PATH)
    if (this.steamPath) {
      this.loadPacks()
    }
  },
  data() {

    return {
      active:null,
      panels:[],
      packs:[],
      steamPath: "",
      items: [],
      packsFound: [],
      loadedFolders: []
    }
  },
  computed:{
    panelHeight(){
      let count = this.panels.filter(x=>x).length
      console.log('gap',this.items)
      //calc(100vh)/open   -panels
      //return "min-height:3000px!important;background-color:red;"
      return `
      min-height:calc((96vh - ${this.panels.length*29}px) / ${count});
      max-height:calc((96vh - ${this.panels.length*29}px) / ${count});
      `
    }
  },
  methods: {
    loadPacks() {
      this.file.fs.readdir(this.steamPath, (error, files) => {
        this.panels = files.filter(x => x.startsWith('The Jackbox Party Pack'))
          .map(x => x.replace('The Jackbox Party Pack', '').replace(' ', ''))
          .map(x => x === '' ? '1' : x)
          .map(x=> parseInt(x))
        this.items = JackBoxTreeData.filter((x)=>this.panels.includes(x.id))
        this.panels = this.panels.map(x=>false)
      }) 

 
    },
    onClick(e){
      console.log(e)
      this.$router.pass('fileviewer',{key:"surivetheinternet"})
    },
    toggle(index){
      console.log(this.panels[index])
      this.$set(this.panels, index, !this.panels[index])
      console.log(this.panels[index])
    }
  }

}
</script>

<style>
a{
  text-decoration: none;
}
* .panel {
 overflow-y: auto;
}
</style>