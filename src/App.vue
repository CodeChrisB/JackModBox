<template lang="pug">
v-app.main
  v-row
    v-col.col-3.mt-2
      SideTreeview
    v-divider(vertical)
    v-col.col-9.px-0
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
    //window.file.save("settings.json", "yoooo")
    this.text = window.file.getSetting(SETTING.STEAM_PATH)

    if(!this.text || this.text === ""){
      
      this.$router.push("settings")
    }
    
  },  
  methods: {
    writeToFileSync(filepath, content) {
      if (window && window.require) {
        window.file.save(filepath, content)
      }
    }
  }
};
</script>

<style scoped>
.main{
  overflow: hidden;
}
.col-3{
  padding: 0px!important;
}
</style>
