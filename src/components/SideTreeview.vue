<template lang="pug">
div
  div(v-if="!isDocumenation")
    CustomDialog
    v-card(
      v-for="(item,index) in items"
    ).ma-0.rounded-0.elevation-1
      v-row.ma-0(
        style="min-height:10px"
        )
          span.text-body-2.hover(@click="toggle(index)").ml-6 {{ item.name }}
          v-spacer.hover(@click="toggle(index)")
          v-menu(offset-y='')
            template(v-slot:activator='{ on, attrs }')
              v-icon(color="grey" v-bind='attrs' v-on='on') mdi-dots-vertical
            v-list
              span.ml-2 {{ item.name }}
              v-divider
              v-list-item(
                v-for='(item, itemIndex) in menu.pack' :key='itemIndex' @click="itemClick(item,index)"
              )
                v-list-item-title {{ item.title }}
      v-divider(v-if="!panels[index]")
      v-col.panel.pa-0(
        v-else
        :style="panelHeight"
        )
          v-row.pl-2.ma-0.pa-0(v-for='game in item.children')
            v-col.col-10.overflow-hidden.pa-0
              v-btn(style="text-align:left", text block='' @click='onClick(game)').d-flex
                div
                  span.justify-start.text-truncate.spanContainer {{ game.name }}
            v-col.col-2.pa-0
              div.iconContainer 
                .d-flex.align-items-center
                  v-menu(offset-y='')
                    template(v-slot:activator='{ on, attrs }')
                      v-icon(color='grey' v-bind='attrs' v-on='on') mdi-dots-vertical
                    v-list
                      span.px-2 {{item.name}} - {{game.name}}
                      v-divider
                      v-list-item(v-for='(item, itemIndex) in menu.game' :key='itemIndex' v-if='game.isMod ? item.visiblity !== State.GameOnly : item.visiblity !== State.ModOnly' @click='gameClick(item,game)')
                        v-list-item-title {{ item.title }}


  div(v-else)
    DocumenationSideView

</template> 

<script>
import { SETTING } from '@/assets/data/SettingData'
import { JackBoxTreeData,AllGames } from '@/assets/data/JackBoxTreeData'
import DocumenationSideView from '@/views/Documenation/DocumenationSideView.vue'
import CustomDialog from './CustomDialog.vue'
import dialog from './dialog'
const State = Object.freeze({
  GameOnly: 1,
  ModOnly: 2,
  Both: 3
})
export default {
  name: 'SettingsView',
  components: { 
    CustomDialog,
    DocumenationSideView
  },
  created() {
    this.file = window.file
    this.SETTING = SETTING
    this.State = State
    this.steamPath = this.file.getSetting(SETTING.STEAM_PATH)
    this.modPath = this.file.getSetting(SETTING.MODS_PATH)
    if (this.steamPath) {
      this.loadPacks()
    }

    let self=this
    this.$listen("documentation-state", (e)=>self.isDocumenation =!!e);
    this.$listen("reloadSideview", self.reloadSideView);
  },
  data() {

    return {
      active: null,
      isDocumenation:false,
      menu: {

        pack: [
          { title: 'Open', id: 0 },
          {title:'Open in Explorer', id:1},
          { title: 'Close others', id: 2 },
        ],
        game: [
          { title: 'Export Content', id: 0, visiblity: State.GameOnly },
          { title: 'Rename', id: 1, mod: true, visiblity: State.ModOnly },
          { title: 'Open Game', id: 2, mod: true, visiblity: State.Both },
          { title: 'Delete Mod', id: 3, mod: true, visiblity: State.ModOnly }
        ]
      },
      panels: [],
      packs: [],
      steamPath: "",
      items: [],
      packsFound: [],
      loadedFolders: []
    }
  },
  computed: {
    panelHeight() {
      let count = this.panels.filter(x => x).length
      //calc(100vh)/open   -panels
      //return "min-height:3000px!important;background-color:red;"
      //max-height:calc((100vh - ${this.panels.length*30}px) / ${count});
      return false ? '' : `
      min-height:calc((100vh - ${this.panels.length * 22}px) /${count});
      max-height:calc((100vh - ${this.panels.length * 22}px) /${count});
      overflow: auto;
      `
    }
  },
  methods: {
    loadPacks() {
      this.file.fs.readdir(this.steamPath, (error, files) => {
        this.panels = files.filter(x => x.startsWith('The Jackbox Party Pack'))
          .map(x => x.replace('The Jackbox Party Pack', '').replace(' ', ''))
          .map(x => x === '' ? '1' : x)
          .map(x => parseInt(x))
        
        if(this.file.getSetting(SETTING.SHOW_ALL_NO_PACKS)){
        //   name: name,
        // id: id ?? name,
        // children: children,
        // disabled: disabled,
          this.items = [...AllGames]
          this.panels=[true]
        }else {
          this.items = JackBoxTreeData.filter((x)=>this.panels.includes(x.id))
          this.panels = this.panels.map(x=>false)
        }
        this.loadModPacks()
      })
    },
    loadModPacks() {
      if(!this.modPath) return
      this.file.fs.readdir(this.modPath, (error, files) => {
        let modPanel = {
          name: 'Mods',
          isMod:true,
          children: [
            ...files.map(x => {
              return {
                name: x,
                id: [this.modPath, x].join('\\'),
                isMod: true

              }
            })
          ]
        }
        console.log()
        if(modPanel.children.length === 0) return
        this.items.unshift(modPanel)
        this.panels.unshift(false)
      })
    },
    onClick(e) {
      this.$router.pass('gameview', {
        key: e.key
      }
      )
    },
    toggle(index) {
      this.$set(this.panels, index, !this.panels[index])
    },
    set(index, state) {
      this.$set(this.panels, index, state)
    },
    itemClick(item, index) {
      if (item.id === 0) {
        this.toggle(index)
      } else if(item.id ===1) {
        if(this.items[index].isMod){
          this.file.openInFileExplorer(this.modPath)
        } else {
          this.file.openInFileExplorer([this.steamPath,'The Jackbox Party Pack'+(this.items[index].id>1 ? ' '+this.items[index].id :'')].join('\\'))
        }
      } else if (item.id === 2) {
        this.panels = this.panels.map((x, i) => index === i)

      } 
    },
    async gameClick(item, game) {
      let tmp = null
      let self = this
      switch (item.id) {
        case 0:
          this.answer = await dialog
            .title('Export Mod')
            .inputType('string')
            .cancelText('Close')
            .okText('Create Mod')
            .html()
            .prompt('Enter a Name for your Mod')

          if (this.answer) {
            this.file.copyFolder(
              [this.steamPath, game.id,].join('\\'),
              [this.modPath, this.answer].join('\\')
            )
          }
          this.reloadSideView()
          break;
        case 1:
          this.answer = await dialog
              .title(`Rename [${game.name}]`)
              .inputType('string')
              .cancelText('Close')
              .okText('Rename')
              .html()
              .prompt('Change the Name of your Mod')
            if (this.answer) {
              tmp = game.id.split('\\')
              tmp[tmp.length-1] = this.answer
              this.file.fs.rename(game.id,tmp.join('\\'),function(err){
                self.reloadSideView()
              })
            }
        break
        case 2:
          this.$router.pass('gameview', {
            key: game.key
          })
          break;
        case 3:
          console.log(game)
          tmp = window.file.deleteFolder(game.id)
          if(tmp) {
            this.reloadSideView()
          }
          break;
       }
    },
    reloadSideView(){
      this.steamPath = this.file.getSetting(SETTING.STEAM_PATH)
      this.modPath = this.file.getSetting(SETTING.MODS_PATH)
      this.items = []
      this.panels = []
      this.loadPacks()
    }
  }

}
</script>
 
<style>
a {
  text-decoration: none;
}

.maxButton{
  min-width: 100%;
}

* .panel {
  overflow-y: auto;
}

.panel::-webkit-scrollbar {
  display: none;
}

.hover {
  cursor: pointer;
  margin: 0px;
}


</style>