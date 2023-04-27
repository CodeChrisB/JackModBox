<template lang="pug">
div
  div(v-for="(elem,index) in internalObj")
    div(
      v-if="['string','number'].includes(typeof elem)"
    )
      v-text-field(
        v-model="internalObj[index]"
        v-if="canShow(elem)"
        :label="firstLetterUp(`${objKey} - [${index+1}]`)"
        @input="onUpdate"
        :flat="true"
        v-on:update="onUpdate"
      )
    div(
      v-else-if="['object'].includes(typeof elem)"
    )
      CustomField(
        :obj="elem" 
        :index="index"
        :flat="true"
        :filter="internalFilter"
        v-on:update="onUpdate"
      )
    div(
      v-else
      v-for="field in Object.keys(elem)"
    )
      v-text-field(
        v-if="typeof elem[field] === 'string' && canShow(field)"
        v-model="internalObj[index][field]"
        :label="field"
        @input="onUpdate"
      )
      
</template>
    
<script>
import CustomField from '@/components/Fields/CustomField.vue'
import { CCState } from '@/assets/data/CustomCheckBoxData'
export default {
  name: 'ArrayField',
  components: {
    CustomField
  },
  props: {
    filter:{
      type: [Object, Array],
      default: () => []
    },
    objKey:{
      type:String
    },
    obj: {
      type: [Array,Object]
    }
  },
  data() {
    return {
      internalObj:[],
      internalFilter:[]
    }
  },
  computed: {
    propsToIgnore() {
      if (!this.internalFilter || this.internalFilter.length === 0) return []

      return this.internalFilter.filter(elem => elem[Object.keys(elem)[0]] === CCState.IGNORE)
        .map(elem => Object.keys(elem)[0])
    },
  },
  methods: {
    canShow(key) {
      //no filter set => everything can be shown
      if (!this.internalFilter) return true
      if ((this.propsToIgnore ?? []).includes(key)) return false
      return true
    },
    onUpdate(){
      this.$emit('update',this.internalObj)
    },
    firstLetterUp(str) {
      return str.charAt(0).toUpperCase() + str.slice(1);
    },
  },
  watch:{
    filter: {
      handler(newVal) {
        console.log('arrayfield',this.internalFilter)
        this.internalFilter = newVal
      },
      immediate: true
    },
    obj: {
      handler(newVal){
        this.internalObj = newVal
      },
      immediate:true
    }
  }
}
</script>
    
<style scoped>
</style>