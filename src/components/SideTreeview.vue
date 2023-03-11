<template lang="pug">
div
  CustomDialog
  v-card(
    v-for="(item,index) in items"
  ).ma-0.rounded-0.elevation-1
    v-row.ma-0(
      style="min-height:30px"
      )
        span.hover(@click="toggle(index)").ml-6 {{ item.name }}
        v-spacer.hover(@click="toggle(index)")
        v-menu(offset-y='')
          template(v-slot:activator='{ on, attrs }')
            v-icon(v-bind='attrs' v-on='on') mdi-dots-vertical
          v-list
            span.ml-2 {{ item.name }}
            v-divider
            v-list-item(
              v-for='(item, itemIndex) in menu.pack' :key='itemIndex' @click="itemClick(item,index)"
            )
              v-list-item-title {{ item.title }}





    v-col.panel(
      v-if="panels[index]"
      :style="panelHeight"
      )
        v-row()(v-for="game in item.children")
          v-btn.col-10(
            text
            @click="onClick(game)"
            )
            span() {{ game.name }}
          v-menu.col-2(offset-y='')
            template(v-slot:activator='{ on, attrs }')
              v-icon(v-bind='attrs' v-on='on') mdi-dots-vertical
            v-list
              span.px-2 {{ `${item.name} - ${game.name}` }}
              v-divider
              v-list-item(
                v-for='(item, itemIndex) in menu.game' :key='itemIndex' @click="gameClick(item,game)"
              )
                v-list-item-title {{ item.title }}

</template> 

<script>
import { SETTING } from '@/assets/data/SettingData'
import  { JackBoxTreeData } from '@/assets/data/JackBoxTreeData'

import CustomDialog from './CustomDialog.vue'
import dialog from './dialog'
export default {
  name: 'SettingsView',
  components:{CustomDialog},
  created() {
    this.file = window.file
    this.SETTING = SETTING
    this.steamPath = this.file.getSetting(SETTING.STEAM_PATH)
    this.modPath = this.file.getSetting(SETTING.MODS_PATH)
    if (this.steamPath) {
      this.loadPacks()
    }
  },
  data() {

    return {
      active:null,
      menu:{

        pack: [
          { title: 'Open',id:0 },
          { title: 'Close others',id:1 },
        ],
        game:[
          {title: 'Export Content',id:0}
        ]
      },
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
      //calc(100vh)/open   -panels
      //return "min-height:3000px!important;background-color:red;"
      //max-height:calc((100vh - ${this.panels.length*30}px) / ${count});
      return false ? '' : `
      min-height:calc((100vh - ${this.panels.length*30}px) /${count});
      max-height:calc((100vh - ${this.panels.length*30}px) /${count});
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
      this.$router.pass('fileviewer',{key:this.steamPath+ e.id})
    },
    toggle(index){
      this.$set(this.panels, index, !this.panels[index])
    },
    set(index,state){
      this.$set(this.panels, index, state)
    },
    itemClick(item,index){
      console.log(item,index)
      if(item.id===0){
        this.toggle(index)
      }else if(item.id === 1){
        this.panels = this.panels.map((x,i)=>index===i)
        
      } else if(item.id === 2)
      console.log(this.panels)
    },
    async gameClick(item,game){
      if(item.id===0){
        //Copy to mod folder
        console.log(item)
        console.log()
        console.log(this.modPath)
        this.answer = await dialog
          .title('Prompt Title')
          .inputType('string')
          .cancelText('Close')
          .okText('Create Mod')
          .html()
          .prompt('Hello message with <strong>html</strong>')
          console.log([this.steamPath,game.id,this.answer].join('\\'))
        if(this.answer){
          this.file.copyFolder(
            [this.steamPath,game.id,].join('\\'),
            [this.modPath,this.answer].join('\\')
          )
        }
        //this.file.copyFolder
      }
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

.panel::-webkit-scrollbar{
    display: none;
  }
.hover{
  cursor: pointer;
  margin: 0px;
}
</style>