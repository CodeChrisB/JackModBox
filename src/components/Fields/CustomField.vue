<template lang="pug">
v-card.mt-1(
  :flat="flat"
)
  div(
    v-for="(key,i) in Object.keys(templateJson)" 
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
        v-else-if="Array.isArray(templateJson[key])"
        :obj="templateJson[key]"
        :obj-key="key"
        @update="onUpdate($event,key)"
      )
      div(
        v-else-if="typeof templateJson[key] === 'object'"
      )
        v-expansion-panels(v-if="internalEditorValue.noExpansion ===false")
          v-expansion-panel
            v-expansion-panel-header
              | Property "{{ key }}"
            v-expansion-panel-content
              CustomField(
                v-if="typeof templateJson[key] === 'object'"
                :obj="templateJson[key]"
                flat
                :editorValues="internalEditorValue"
                :index="i"
                :filter="internalFilter"
                :searchInput="internalSearch"
              )
        div(v-else)
          CustomField(
            v-if="typeof templateJson[key] === 'object'"
            :obj="templateJson[key]"
            flat
            :editorValues="internalEditorValue"
            :index="i"
            :filter="internalFilter"
            :searchInput="internalSearch"
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
    editorValues: {
      type: Object,
      default: ()=> {}
    },
    index: {
      type: Number
    },
    filter: {
      type: [Object, Array],
      default: () => []
    },
    obj: {
      type: Object
    },
    searchInput: {
      type: String
    },
    showModded: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      templateJson: {},
      internalFilter: [],
      internalSearch: '',
      internalIndex: -1,
    }
  },
  created() {
    //type
    //typeof obj[key]
    Object.keys(this.obj).forEach(x => {
      this.templateJson[x] = this.obj[x]
    })

    this.internalIndex = this.index


    /*
    todo create an anyfield that can work with all sorts of types
    ArrayField gets an array as input
    *creates the input fields for the elements
    *add/delete button's for entries
    */


  },
  computed: {
    filterTriesToSearch() {
      return Object.values(this.internalFilter).some(value => value === 1);
    },
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
    emit() {
      this.$emit('update', { content: this.templateJson, index: this.internalIndex })
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
    editorValues:{
      handler(newVal){
        this.internalEditorValue = newVal??{}
      },
      immediate:true
    },
    filter: {
      handler(newVal) {
        this.internalFilter = newVal
      },
      immediate: true
    },
    index: {
      handler(newVal) {
        this.internalIndex = newVal
      },
    },
    searchInput: {
      handler(newVal) {
        this.internalSearch = newVal
      }
    },
    obj: {
      handler(newVal) {
        Object.keys(newVal).forEach(x => {
          this.templateJson[x] = this.obj[x]
        })
        this.$forceUpdate()
      },
      deep: true
    },

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