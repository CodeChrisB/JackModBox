<template lang="pug">
div
  div(v-if="isDocumenation === false")
    v-row().pa-0.ml-2.mr-6.mt-1
      v-btn.mb-3(
          v-if="isDocumenation === false && sideOpen === true"
          text
          icon
          @click="toggleSideview",
          small
        ) 
          v-icon(small) mdi-chevron-double-left
      v-btn.mb-3(
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
      v-icon.ml-6.mb-3(
        v-if="isDocumenation === false && sideOpen"
        small 
        @click="toSettings"
      ) mdi-cog


    v-row.ma-0.pa-0
      v-divider
  
  div(v-if="isDocumenation === true")
    v-row.mr-4.pt-4
      v-spacer
      v-icon(
        v-if="isDocumenation"
        @click="closeDocumentation()"
      ) mdi-close


        

        
  
  </template>
  
<script>

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
    sideViewIcon(){
      return this.sideOpen ? 'chevron-double-left': 'mdi-playlist-play'
    }
  },
  created() {
    let self = this
    this.$listen('setCustomPath-BackTo', (e) => self.backTo = e)
    this.$listen("documentation-state", (e) => self.isDocumenation = !!e);
    this.$listen('sideviewState',(e)=> self.sideOpen = e)
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
      this.$broadcast("documentation-state", false);
      this.$router.push({ name: 'home' })
    },
    toggleSideview(){
      this.$broadcast('toggleSideview',false)
    },  
    toSettings() {
      this.$router.push({ name: 'settings' })
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