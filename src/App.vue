<template lang="pug">
v-app.main
  v-row
    div(
      :style="sideCol"
      ).mt-2.mb-0
      v-card(style="min-height:101vh").rounded-0
        SideTreeview(v-show="treeviewOpend")
        IconDrawer(v-show="!treeviewOpend")

    div(:style="mainCol")
      CustomPath.mt-4
      router-view.ml-1(:style="mainCol")
    
      

</template>

<script>
import HelloWorld from './components/HelloWorld';
import SideTreeview from './components/SideTreeview.vue';
import CustomPath from './components/CustomPath.vue';
import IconDrawer from './components/IconDrawer.vue'
import { SETTING } from './assets/data/SettingData'
import { Code } from '@/assets/data/BusCode'
export default {
  name: 'App',

  components: {
    HelloWorld,
    SideTreeview,
    CustomPath,
    IconDrawer
  },
  data(){
    return {
        main:'75vw',
        side:'25vw',
        iconDrawerSize:'60px',
        treeviewOpend:true
    }
  },
  created(){
    let self = this
    this.$listen(Code.SetToggleSideView,(e)=>self.SetToggleSideView(e))
  },
  computed:{
    mainCol(){
      return `min-width:${this.main};max-width:${this.main};`
    },
    sideCol(){
      return `min-width:${this.side};max-width:${this.side};`
    }
  },
  mounted() {
    this.text = window.file.getSetting(SETTING.STEAM_PATH)

    if(!this.text || this.text === ""){
      
      this.$router.push("settings")
    }
    
  },
  methods:{
    SetToggleSideView(e){
      if(e !== undefined) this.treeviewOpend = e
      else this.treeviewOpend = !this.treeviewOpend

      if(!this.treeviewOpend){
        this.side= this.iconDrawerSize
        this.main = `calc(100vw - ${this.iconDrawerSize})`
      }else{
        this.side='25vw'
        this.main='75vw'
      }
      this.$forceUpdate()
      this.$nextTick(()=>{
        this.$broadcast(Code.InfoSideViewState,this.treeviewOpend)
      })
    }
  }
};
</script>

<style scoped>
html{
  overflow: hidden;
}
.col-3{
  padding: 0px!important;
}
</style>
