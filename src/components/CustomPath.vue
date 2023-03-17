<template lang="pug">
div
  v-row.pa-0.ml-2.mt-1
    v-icon.mb-3(
      small 
      @click="toSettings"
    ) mdi-cog

    v-btn.mb-3(
      text
      icon
      @click="back()",
      small
    ) 
      v-icon(small) mdi-arrow-left
    v-breadcrumbs.pa-0.mb-3(:items="computedCrumbs",divider="/").p0.pl-1
      v-breadcrumbs-item.pa-0(
        v-for="(item,index) in computedCrumbs"
        @click="$router.pass('fileviewer',{key:item.fullPath})"
      )
        span {{ item.text }}
        span(v-if="index !== computedCrumbs.length-1") /
  v-row.ma-0.pa-0
    v-divider.mb-2

        

        
  
  </template>
  
<script>

export default {
  name: 'CustomPath',
  data: () => ({
    path: [],
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
    }
  },
  created() {
    let self = this
    this.$listen('setCustomPath-BackTo', (e) => self.backTo = e)
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
      console.log(this.backTo.name, this.path.slice(-1)[0])
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
    toSettings() {
      this.$router.replace("/settings")
    }
  }
};
</script>
  