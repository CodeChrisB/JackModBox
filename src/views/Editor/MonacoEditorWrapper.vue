<template lang="pug">
MonacoEditor(
  theme="vs-dark",
  language="json",
  automaticLayout: true,
  :options="options",
  :editorMounted="editorMounted",
  @change="onChange" 
)
</template>
<script>
import MonacoEditor from 'monaco-editor-vue';
import { EditorMode } from '@/assets/data/Editor';

export default {
  name: "MonacoEditorWrapper",
  components: { MonacoEditor },
  props:{
    fileContent:{
      type:String
    }
  },
  data() {
    return {
      //Editor
      editorMode: -1,
      //Info About File
      fileName: '',
      internalValue: '',
      jsonContent: {},


      //Check if needed after rework
      isDirty: false,
      options: {
        editor: null,
        value: "Loading File..."
        //Monaco Editor Options
      }
    };
  },
  beforeCreate() {
    this.EditorMode = EditorMode
  },
  async created() {
  },
  async mounted() {
    document.addEventListener("keydown", this.doSave);
  },
  beforeDestroy() {
    document.removeEventListener("keydown", this.doSave);
  },
  methods: {
    editorMounted(value) {
      this.editor = value
      this.editor.getModel().setValue(this.internalValue)
    },
    onChange(value) {
      this.isDirty = true
      this.$emit('update',this.editor.getValue())
    },
    onResize(value) {
      this.editor?.layout()
    },
  },
  watch:{
    fileContent:{
      handler(newVal){
        console.log('xxxx',newVal)
        this.internalValue = newVal
        if(this.editor){
          this.editor.getModel().setValue(newVal);
        }
      },
      immediate:true
    }
  }
};
</script>
  
<style scoped>
.me {
  width: 100%;
  height: 100%;
  max-height: 100% !important;
  margin: 0;
  padding: 0;
  overflow: hidden;
}
</style>