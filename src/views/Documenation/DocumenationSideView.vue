<template lang="pug">
div
  v-row(v-for="doc in Documenation").ma-2.ml-6
    v-btn.px-6(
      @click="$broadcast('documentation-data',doc.filename)"
      block
      text
    )
      |{{ doc.title }}
    v-divider
</template>
    
<script>
import { Documenation } from '@/assets/data/DocumenationData';
export default {
  name: 'DocumenationSideView',
  data() {
    return {
    }
  },
  created(){
    this.Documenation = Documenation
  },
  methods: {

  }
}
</script>
    