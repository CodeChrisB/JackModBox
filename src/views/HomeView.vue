<template lang="pug">
div.container(style="min-width:100%;height:100%")

  v-img.img(
    max-width="15vw"
    :src="require(`@/assets/images/mainMenu/Jackmodbox.png`)"
    )
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'

export default {
  name: 'HomeView',
  components: {
    HelloWorld
  }
}
</script>

<style scoped>
.container{
  display: flex;
  justify-content: center;
  align-items: center;
}
.img{
  opacity: 0.5;
}
</style>
