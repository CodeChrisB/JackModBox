<template lang="pug">
div(
  v-else
  min-height="101vh"
).pl-4
  v-icon(@click="openSideview").my-4.mx-2 mdi-chevron-double-right
  v-icon(@click="toSettings").my-4.mx-2 mdi-cog
  v-btn(v-for='icon in icons' :key='icon.icon' icon='')
    v-icon(@click='callBus(icon)') {{ icon.icon }}


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
        this.$listen(Code.SetIconDrawerContent,e=>this.setIcons(e))
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
        setIcons(e){
          this.icons = []
          if(!e) return
          if(!Array.isArray(e)) return
          if(e.some(elem=>!(elem.icon && elem.callee))) return

          //an icon has 2 props
          /*
          {
            icon:mdi-account
            callee:'iconDrawer'
            params: [Optional data any data...]
          }
          */
          
          this.icons = e
          this.$set(this,'icons',e)
        },
        toSettings() {
          this.$router.push({ name: 'settings' })
        },
      }
    };
    </script>
