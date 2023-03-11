<template lang="pug">
v-row.ma-1
    CustomField.container(
      v-for="(obj,index) in internalValue.content"
      :obj="obj" 
      :index="index"
      show-modded
      v-on:update="onUpdate"
    )

</template>
    
<script>
import {CEErrors} from '@/assets/data/EditorValues'
import CustomField from '@/components/CustomField.vue'
export default {
  name: 'CustomEditor',
  components: {
    CustomField
  },

  data() {
    return {
      internalValue:[]
    }
  },
  props:{
    jsonFile:{
      type:Object
    }
  },  
  created() {
    //Rules
      //If the file is not a proper JSON say it and ignore
      //**Capture Stuff
        //If there is no content prop ignore it
        //When the content is not an array ignore it
        //When the elements in the Array only contain an id prop ignore it

      //Do not show id prop
      //check what type of input it is
      //string 
      //int
      //decimal
      //not sure? use string the user should know... hopefully

  },
  methods:{
    onUpdate(e){
      this.internalValue.content[e.index] = e.content
      this.$emit('changed',this.internalValue.content)
    }
  },
  watch:{
    jsonFile: {
      handler(newVal){
          this.internalValue = newVal
        if(!newVal.content) {this.$emit('error',CEErrors.NoContent);return;}
        if(!Array.isArray(newVal.content)) {this.$emit('error',CEErrors.ContentNotArray);return;}
        if(Object.keys(newVal.content[0])[0] === 'id' && Object.keys(newVal.content[0]).length === 1) {this.$emit('error',CEErrors.OnlyIdContent);return;}
        this.internalValue = newVal
      },
      immediate:true
    }
  }

}
</script>
<style scoped>
.container {
  min-width: 40%;
  max-width: 100px;
}
</style>