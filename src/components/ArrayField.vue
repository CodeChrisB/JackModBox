<template lang="pug">
div
  div(v-for="(elem,index) in internalObj")
    div(v-for="field in Object.keys(elem)")
      v-text-field(
        v-if="typeof elem[field] === 'string'"
        v-model="internalObj[index][field]"
        :label="field"
        @input="onUpdate()"
      )
      
</template>
    
<script>

export default {
  name: 'ArrayField',
  components: {

  },
  props: {
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