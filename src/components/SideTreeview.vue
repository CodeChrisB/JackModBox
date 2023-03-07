<template lang="pug">
div
  v-row
    v-switch.ml-6(
      label="Show Mods"
    )
    span {{ active }}
    v-spacer
    v-btn.mt-4.mr-4(
      icon
      to="settings"
    )
      v-icon mdi-cog
    template(v-slot:prepend)
      v-label Directory 
    template(v-slot:label)
      v-label Mods 
  v-treeview.gameView(
    v-model="active"
    v-if="steamPath !== ''"
    :items="items",
    dense,
    return-object
    )
      template(v-slot:label="{item}")
        div(@click="onClick(item)")
          span() {{item.name}}

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
      files: {
        html: 'mdi-language-html5',
        jet: 'mdi-code-json',
        js: 'mdi-nodejs',
        json: 'mdi-code-json',
        md: 'mdi-language-markdown',
        pdf: 'mdi-file-pdf',
        png: 'mdi-file-image',
        txt: 'mdi-file-document-outline',
        xls: 'mdi-file-excel',
      },
      packs:[],
      steamPath: "",
      items: [],
      packsFound: [],
      loadedFolders: []
    }
  },
  methods: {
    getNodeById(id, getIndex = false) {
      return getIndex ? this.items.findIndex(x => x.id === id) : this.items.find(x => x.id === id)
    },
    genId(file) {
      return file + Math.random().toString(36).replace(/[^a-z]+/g, '').substr(2, 10)+Math.random().toString(36).replace(/[^a-z]+/g, '').substr(2, 10);
    },

    loadPacks() {
      this.file.fs.readdir(this.steamPath, (error, files) => {
        this.packs = files.filter(x => x.startsWith('The Jackbox Party Pack'))
          .map(x => x.replace('The Jackbox Party Pack', '').replace(' ', ''))
          .map(x => x === '' ? '1' : x)
          .map(x=> parseInt(x))

        this.items = JackBoxTreeData.filter((x)=>this.packs.includes(x.id))
      }) 

 
    },
    loadRecursivley(path,i) {
      if(i>2) return
      let INDEX_FILES = []
      let INDEX_FOLDERS = []
      this.file.fs.readdir(path, (error, files) => {
        if(files.length === 0) return []
        files.forEach(file => {
          let ext = file.split('.')[1]

          // console.log('file',[path,file].join('\\'),this.file.isFile([path,file].join('\\')))

            INDEX_FILES.push({
              name: file,
              id: this.genId(file),
              file: this.file.isFile([path,file].join('\\')) ? ext : 'folder',
              children: this.file.isFile([path,file].join('\\')) ? 
              [] :
              this.loadRecursivley(path+"\\"+file,i++) // has content
            })
            console.log('stuff',file)

        })
      })

      INDEX_FILES = INDEX_FOLDERS.concat(INDEX_FILES)
      
      return INDEX_FILES 

    },
    async onTreeview(e) {
      e = e.filter(openId => !this.loadedFolders.includes(openId))
      this.loadedFolders = this.loadedFolders.concat(e)
      if (Array.isArray(e) && e.length === 0) return
      e = e[0]

      let searchPath = [this.steamPath, 'The Jackbox Party Pack' + (e === 1 ? '' : ' ' + e)].join('\\')

      let packContent = this.loadRecursivley(searchPath,0)

      this.items[this.getNodeById(e, true)].children = packContent
    },
    onClick(e){
      this.$router.pass('fileviewer',{key:e.key})
    }
  }

}
</script>

<style>
v-deep * .v-treeview-node__level {
  width: 8px!important;
}
a{
  text-decoration: none;
}
</style>