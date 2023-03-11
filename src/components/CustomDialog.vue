<template lang="pug">
v-card(v-if='dialog.state.active')
  .dialog-inner
    h3(v-if='dialog.state.title') {{dialog.state.title}}
    p(v-if='dialog.state.html' v-html='dialog.state.message')
    p(v-else='') {{ dialog.state.message }}
    input(v-if="dialog.state.type === 'prompt'" :type='dialog.state.inputType' v-model='userInput')
    div
      v-btn(v-if="dialog.state.type !== 'alert'" @click='dialog.cancel()') {{dialog.state.cancelText}}
      v-btn(@click='dialog.ok(userInput)') {{dialog.state.okText}}
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

<style>
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
  padding:20px;
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