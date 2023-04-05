<template lang="pug">
v-app.main
  v-row
    v-col(
      v-if="col.side===3"
      :class="sideCol"
      ).mt-2.mb-0
      v-card.rounded-0
        SideTreeview

    v-col(:class="mainCol").col-9.px-0
      CustomPath
      router-view
    
      

</template>

<script>
import HelloWorld from './components/HelloWorld';
import SideTreeview from './components/SideTreeview.vue';
import CustomPath from './components/CustomPath.vue';
import { SETTING } from './assets/data/SettingData'
export default {
  name: 'App',

  components: {
    HelloWorld,
    SideTreeview,
    CustomPath
  },
  data(){
    return {
      col:{
        main:9,
        side:3
      }
    }
  },
  created(){
    let self = this
    this.$listen('toggleSideview',self.toggleSideview)
  },
  computed:{
    mainCol(){
      return `col-${this.col.main} ${this.col.side === 0 ? 'ma-2':null}`
    },
    sideCol(){
      return `col-${this.col.side}`
    }
  },
  mounted() {
    this.text = window.file.getSetting(SETTING.STEAM_PATH)

    if(!this.text || this.text === ""){
      
      this.$router.push("settings")
    }
    
  },
  methods:{
    toggleSideview(){
      if(this.col.side>0){
        this.col.side=0
        this.col.main=12
        this.$broadcast('sideviewState',false)
      }else{
        this.col.side=3
        this.col.main=9
        this.$broadcast('sideviewState',true)
      }
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
