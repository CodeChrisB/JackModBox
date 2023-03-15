<template lang="pug">
v-app.main
  v-row
    v-col.col-3.mt-2
      SideTreeview
    v-divider(vertical)
    v-col.col-9.px-0.pr-4
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
  mounted() {
   
    this.text = window.file.getSetting(SETTING.STEAM_PATH)

    if(!this.text || this.text === ""){
      
      this.$router.push("settings")
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
