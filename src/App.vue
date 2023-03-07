<template lang="pug">
v-app.main
  v-row
    v-col.col-3.pl-8.mt-2
      SideTreeview
    v-divider(vertical)
    v-col.col-9.px-0
      router-view
      

</template>

<script>
import HelloWorld from './components/HelloWorld';
import SideTreeview from './components/SideTreeview.vue';
import { SETTING } from './assets/data/SettingData'
export default {
  name: 'App',

  components: {
    HelloWorld,
    SideTreeview
  },
  
  data: () => ({
    breadCrumbs: [
        {
          text: 'Dashboard',
          disabled: false,
          href: 'breadcrumbs_dashboard',
        },
        {
          text: 'Link 1',
          disabled: false,
          href: 'breadcrumbs_link_1',
        },
        {
          text: 'Link 2',
          disabled: true,
          href: 'breadcrumbs_link_2',
        },
      ],
  }),
  mounted() {
    //window.file.save("settings.json", "yoooo")
    this.text = window.file.getSetting(SETTING.STEAM_PATH)

    if(!this.text || this.text === ""){
      
      this.$router.push("settings")
    }
    

    // this.jsonReader("settings.json",(err,fileData) => {
    //   console.log(fileData)
    // })

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
