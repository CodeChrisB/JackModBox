<template lang="pug">
div(
  v-else
  min-height="101vh"
).pl-4
  v-icon(@click="openSideview").my-4.mx-2 mdi-chevron-double-right
  v-icon.my-4.mx-2 mdi-cog
  v-icon.my-4.mx-2 mdi-account   

</template>
      
    <script>
    
    export default {
      name: 'CustomPath',
      data: () => ({

      }),
      computed: {
      },
      created() {
      },
      watch: {
      },
      methods: {
        openSideview(){
          this.$broadcast('toggleSideview')
        }
      }
    };
    </script>
