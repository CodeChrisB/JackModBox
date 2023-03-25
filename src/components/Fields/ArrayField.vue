<template lang="pug">
div
  div(v-for="(elem,index) in internalObj")
    div(
      v-if="['string','number'].includes(typeof elem)"
    )
      span {{ typeof elem }}
      v-text-field(
        v-model="internalObj[index][field]"
        :label="objKey"
        @input="onUpdate"
        :flat="true"
        v-on:update="onUpdate"
      )
    div(
      v-if="['object'].includes(typeof elem)"
    )
      custom-field(
        :obj="elem" 
        :index="index"
        :flat="true"
        v-on:update="onUpdate"
      )
    div(
      v-else
      v-for="field in Object.keys(elem)"
    )
      v-text-field(
        v-if="typeof elem[field] === 'string'"
        v-model="internalObj[index][field]"
        :label="field"
        @input="onUpdate"
      )
      
</template>
    
<script>
import CustomField from '@/components/Fields/CustomField.vue'
export default {
  name: 'ArrayField',
  components: {
    CustomField
  },
  props: {
    objKey:{
      type:String
    },
    obj: {
      type: [Array,Object]
    }
  },
  data() {
    return {
      internalObj:[]
    }
  },
  methods: {
    onUpdate(){
      this.$emit('update',this.internalObj)
    }
  },
  watch:{
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