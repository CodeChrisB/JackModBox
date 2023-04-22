<template lang="pug">
v-card(v-if='dialog.state.active').rounded-lg
    .dialog-inner
      v-app-bar.pa-0.ma-0(
        v-if='dialog.state.title'
        color='primary'
      )
        span.text-h5(style="color:white") {{dialog.state.title}}
      .pa-6   
        p(v-if='dialog.state.html' v-html='dialog.state.message')
        p(v-else='') {{ dialog.state.message }}
        v-select(
          v-if="dialog.state.selectContent.length>0"
          v-model="userInput"
          :label="dialog.state.label"
          :items="dialog.state.selectContent"
        )
        v-text-field(
          v-model='userInput'
          :label="dialog.state.label"
          v-else-if="dialog.state.type === 'prompt'" 
          :type='dialog.state.inputType' 
          )
        div
          v-btn(
            v-if="dialog.state.type !== 'alert'" 
            @click='dialog.cancel()'
            color="warning"
            
          ).ma-2 {{dialog.state.cancelText}}
          v-btn(
            @click='dialog.ok(userInput)'
            color="primary"
            :disabled="(dialog.state.inputRequired && userInput.length<1) && dialog.state.type !=='confirm'",
          ).ma-2 {{dialog.state.okText}}

    .dialog-bg(@click='dialog.cancel()')
</template>

<script>
import dialog from './dialog';
export default{
  data(){
    return {
      userInput: '',
      dialog
    }
  },
}
</script>

<style scoped>
.dialog-bg{
  z-index: 10;
  position:fixed;
  top:0;
  left:0;
  right:0;
  bottom:0;
  background:rgba(0,0,0,.5);
}
.dialog-inner{
  background:white;
  z-index: 11;
  position:fixed;
  top:200px;
  left: 50%;
  transform: translateX(-50%);
  min-width:200px;
}   
input{
  border: 1px solid black;
}
</style>