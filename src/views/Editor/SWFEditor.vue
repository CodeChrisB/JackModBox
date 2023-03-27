<template lang="pug">
div.ml-3(style="min-width:100%;min-height:90vh")
  v-row.ma-2(v-for="text in todoText")
    v-col.col-6
      span() {{ text }}
  
</template>
      
<script>
import CustomField from '@/components/Fields/CustomField.vue'
export default {
  name: 'SWFEditor',
  components: {
    CustomField
  },

  data() {
    return {
      internalValue: '',
      internalPath: '',
      internalSwf:{},
      todoText: [
        'This feature is currently not implemented, it will probably be not implemented before June of 2023 (maybe even Later)',
        'You may just press the back button because you cant do anything here.',
        'Still reading? Do you even know what a swf file is? It\'s an Adobe flash file. The fact that Jackbox is using something called as3 (a specifc verison of a coding language) makes it even harder since decoding swf files written in as3 isnt that commonly done and this means more work for me.',
        'Now for real go no image is going to pop up after 10 minutes. I promise'
      ]
    }
  },
  props: {
    filePath: {
      type: String,
      required: true
    },
  },
  created() {

  },
  methods: {
    async loadSWF() {

    }
  },
  watch: {
    filePath: {
      handler(newVal) {
        this.internalPath = newVal
        this.loadSWF()
      },
      immediate: true,
    }
  }

}
</script>
<style scoped></style>