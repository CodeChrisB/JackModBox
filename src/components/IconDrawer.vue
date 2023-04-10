<template lang="pug">
div(
  v-else
  min-height="101vh"
).pl-4
  v-icon(@click="openSideview").my-4.mx-2 mdi-chevron-double-right
  v-icon(@click="toSettings").my-4.mx-2 mdi-cog
  v-icon(
    v-for="icon in icons"
    @click="callBus(icon)"
  ).my-4.mx-2 {{ icon.icon }}

</template>
      
    <script>
import { Code } from '@/assets/data/BusCode';

    
    export default {
      name: 'CustomPath',
      data() {
        return {
          icons:[
            {
              icon:'mdi-cog',
              callee:'cogButton'
            }
          ]
        }
      },
      computed: {
      },
      created() {
        this.$listen('iconDrawer-set',e=>this.setIcons(e))
      },
      watch: {
      },
      methods: {
        callBus(icon){
          this.$broadcast(icon.callee,icon.params)
        },  
        openSideview(){
          this.$broadcast(Code.SetToggleSideView,true)
        },
        setIcon(e){
          if(!e) return
          if(!Array.isArray(e)) return

          //an icon has 2 props
          /*
          {
            icon:mdi-account
            callee:'iconDrawer'
            params: [Optional data any data...]
          }
          */
          this.icons = e
        },
        toSettings() {
          this.$router.push({ name: 'settings' })
        },
      }
    };
    </script>
