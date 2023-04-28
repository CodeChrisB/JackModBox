<template lang="pug">
v-row.ma-0.pa-0
  v-btn(icon)
    v-icon(
      @click="onClick()"
      @contextmenu="onRightClick()"
      :color="computedColor"
    ) {{computedIcon}}
  span(
    style="margin-top: 6px !important;"
    :class="computedClass"
  ) {{label}}
</template>
    
<script>
import { CCState } from '@/assets/data/CustomCheckBoxData';
export default {
  name: 'CustomField',
  components: {

  },
  props: {
    label:{
      type:String
    },
    val:{
      type: Number,
      default: () => CCState.OFF
    }
  },
  computed:{
    computedIcon(){
      return this.icons[this.innerValue]
    },
    computedColor(){
      return this.colors[this.innerValue]
    },
    computedClass(){
      if(this.innerValue === CCState.IGNORE) return 'text-decoration-line-through'
      return null
    }
  },
  data() {
    return {
      //In this component we can assume that CCState's max value is 2
      //At the time this Enum get's changed this component also will need some changes
      icons:[
        'mdi-checkbox-blank-outline',
        'mdi-checkbox-marked',
        'mdi-checkbox-blank-off-outline'
      ],
      colors:[
        null,
        'primary',
        'error'
      ],
      innerValue:0

    }
  },
  methods: {
    onClick(){
      if(this.innerValue>=2) this.innerValue=0;
      else {this.innerValue++}
      this.$emit('update',this.innerValue)
    },
    onRightClick(){
      this.innerValue = CCState.OFF
      this.$emit('update',this.innerValue)
    },
    CCStateToInnerVal(state){
      if(CCState.OFF === state) return 0
      if(CCState.ON === state) return 1
      if(CCState.IGNORE === state) return 2
      return null
    }
  },
  watch:{
    val:{
      handler(newVal){
        this.innerValue = this.CCStateToInnerVal(newVal)?? this.innerValue
      },
      immediate:true,
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