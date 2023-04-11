<template lang="pug">
div
  div(v-if="isDocumenation === false")
    v-row().pa-0.ml-2.mr-6.mt-1.mb-0
      v-btn(
          v-if="isDocumenation === false && sideOpen === true"
          text
          icon
          @click="SetToggleSideView",
          small
        ) 
          v-icon(small) mdi-chevron-double-left
      v-btn(
        v-if="isDocumenation === false && anyData"
        text
        icon
        @click="back()",
        small
      ) 
        v-icon(small) mdi-arrow-left
        
      v-breadcrumbs(
        v-if="false"
        :items='computedCrumbs'
        )
        v-breadcrumbs-item(v-for='(item,index) in computedCrumbs' :key='index' @click="$router.pass('fileviewer',{key:item.fullPath})")
          span {{ item.text }}
          span(v-if='index !== computedCrumbs.length-1') /
      span(style="max-width:65vw").text-truncate {{  computedText  }}


      v-spacer
      v-btn(
        v-if="isDocumenation === false && anyData"
        text
        icon
        @click="toPage",
        small
      ) 
        v-icon(small)  {{ routeIcon }}



    v-row.ma-0.pa-0
      v-divider
  
  div(v-if="isDocumenation === true")
    v-row.mr-4.pt-4
      v-spacer
      v-icon(
        v-if="isDocumenation"
        @click="closeDocumentation()"
      ) {{ routeIcon }}
    


        

        
  
  </template>
  
<script>
import { Code } from '@/assets/data/BusCode';


export default {
  name: 'CustomPath',
  data: () => ({
    isDocumenation: false,
    path: [],
    sideOpen:true,
    backTo: {
      name: null,
      key: null
    }
  }),
  computed: {
    computedCrumbs() {
      if (!this.path || this.path === [])
        return []

      let currentPath = ""

      let fullNew = this.path.map(element => {
        currentPath += currentPath === "" ? element : "\\" + element
        return {
          text: element,
          disabled: false,
          fullPath: currentPath

        }
      });
      fullNew = fullNew.filter(x => x.text !== "")
      return fullNew
    },
    computedText() {
      return this.computedCrumbs.map(x => x.text).join('/')
    },
    anyData(){
      return this.computedCrumbs.length>0
    },
    routeIcon(){
      return this.$route.name === 'settings' ? 'mdi-home' : 'mdi-cog'
    },
    sideViewIcon(){
      return this.sideOpen ? 'chevron-double-left': 'mdi-playlist-play'
    }
  },
  created() {
    let self = this
    this.$listen(Code.SetCustomPathBackTo, (e) => self.backTo = e)
    this.$listen(Code.InfoDocumentationState, (e) => self.isDocumenation = !!e);
    this.$listen(Code.InfoSideViewState,(e)=> self.sideOpen = e)
    this.$broadcast(Code.SetIconDrawerContent,undefined)
  },
  watch: {
    "$route.params.key": {
      handler(newVal) {
        if (!newVal) return
        this.path = newVal?.split('\\').filter(x => x !== "")
      },
      immediate: true
    }
  },
  methods: {
    back() {
      if (this.backTo.name === this.path.slice(-1)[0]) {
        this.$router.pass('gameview', {
          key: this.backTo.key
        })
        return
      }

      this.path = this.path.slice(0, this.path.length - 1)
      if (this.path.length === 0) {
        this.$router.push({ name: 'home' })
      } else {
        this.$router.pass('fileviewer', { key: this.path.join('\\') })
      }
    },
    closeDocumentation() {
      this.$broadcast(Code.InfoDocumentationState, false);
      this.$router.push({ name: 'home' })
    },
    SetToggleSideView(){
      this.$broadcast(Code.SetToggleSideView,false)
    },  
    toPage() {
      let name = 'settings'
      if(name === this.$route.name) name ='home'
      this.$router.push({ name: name })
    },
  }
};
</script>
  
<style>
.container {
  white-space: nowrap;
  overflow-x: auto;
  min-width: 80vw
}
</style>