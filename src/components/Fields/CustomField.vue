<template lang="pug">
v-card(:flat="flat").form.mt-1
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
    let self =this
    this.$listen('filter',(filter) => {
      self.$set(self,'filter',filter) .interalFilter = filter
      console.log(filter)
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
      filter:[],
      templateJson: {}
    }
  },
  methods: {
    canShow(key){
      if(this.filter[key] ===CCState.IGNORE) return false
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