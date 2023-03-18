<template lang="pug">
v-card.form.mt-1(
  v-if="showPrompt"
  :flat="flat"
)
  span {{ propsToIgnore }}
  div(
    v-for="key in Object.keys(templateJson)" 
    v-if="!['modded'].includes(key) && canShow(key)"
  )
    v-col
      v-text-field(
        v-if="(typeof templateJson[key] === 'number' || typeof templateJson[key] === 'string')"
        v-model="templateJson[key]"
        :label="firstLetterUp(key)"
        @input="onUpdate($event,key)"
        hide-details
        rows=2
      )
      array-field(
        v-if="Array.isArray(templateJson[key])"
        :obj="templateJson[key]"
        :obj-key="key"
        @update="onUpdate($event,key)"
      )
  v-spacer
  v-checkbox(
    v-if="showModded"
    v-model="templateJson['modded']"
    label="Already Modded"
    hide-details
    @change="onUpdate($event,'modded')"
  )
  
</template>
  
<script>
import { CCState } from '@/assets/data/CustomCheckBoxData'
import ArrayField from './ArrayField.vue'
export default {
  name: 'CustomField',
  components: {
    ArrayField
  },
  props: {
    flat: {
      type: Boolean,
    },
    index: {
      type: Number
    },
    filter:{
      type:[Object,Array],
      default: ()=>[]
    },
    obj: {
      type: Object
    },
    showModded: {
      type: Boolean,
      default: false
    }
  },
  created() {
    //type
    //typeof obj[key]
    Object.keys(this.obj).forEach(x => {
      this.templateJson[x] = this.obj[x]
    })

    
    /*
    todo create an anyfield that can work with all sorts of types
    ArrayField gets an array as input
    *creates the input fields for the elements
    *add/delete button's for entries
    */


  }, 
  data() {

    return {
      templateJson: {},
      internalFilter: []
    }
  },
  computed:{
    filterTriesToSearch(){
      return Object.values(this.internalFilter).some(value => value === 1);
    },
    propsToIgnore(){
      if(!this.internalFilter) return []
      return this.internalFilter.filter(elem=>elem[Object.keys(elem)[0]] === CCState.IGNORE)
      .map(elem=>Object.keys(elem)[0])
    },  
    propsToSearch(){
      if(!this.internalFilter) return []
      return this.internalFilter.filter(elem=>elem[Object.keys(elem)[0]] === CCState.ON)
      .map(elem=>Object.keys(elem)[0])
    },  
    showPrompt(){
      return true
      //the filter does not even try to search for text just skip

      //if(this.filterTriesToSearch === false) return true

      //let xxx = Object.values(this.propsToFilter).some(val=> (this.templateJson[val]+"").includes(this.searchInput))
      //return xxx
    },
  },
  methods: {
    canShow(key){
      //no filter set => everything can be shown
      if(!this.internalFilter) return true 
      if((this.propsToIgnore??[]).includes(key)) return false
      return true
    },
    emit() {
      this.$emit('update', { content: this.templateJson, index: this.index })
    },
    firstLetterUp(str) {
      return str.charAt(0).toUpperCase() + str.slice(1);
    },
    onUpdate(e, key) {
      this.templateJson[key] = e
      this.emit()
    },
  },
  watch: {
    filter: {
      handler(newVal) {
        this.internalFilter = newVal
      },
      immediate: true
    }
  }
}
</script>
  
<style scoped>
.form {
  max-width: fit-content;
}

.col {
  padding: 0px;
}
</style>