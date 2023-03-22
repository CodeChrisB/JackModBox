<template lang="pug">
div(style="overflow-y:scroll").mt-1
  v-row.mt-1.pl-2
    v-card(style="width:100%;padding:3px;background-color:#0078d7")
      div(style="max-width:95%;display: flex; align-items: center;")
        v-btn.ml-4(icon @click="backToFileviewer")
          v-icon mdi-arrow-left
        v-icon(v-if="!isCustomEditor" @click="showModded=!showModded") {{ showModded ? 'mdi-check-all' : 'mdi-card-remove' }}
        v-icon(medium).mr-2(@click="setEditor(EditorMode.CustomEditor)") {{ isCustomEditor ? 'mdi-form-select' : 'mdi-book-open'}}
        v-btn.mr-1(icon medium :disabled="!isDirty" @click="onSave")
          v-icon(medium) mdi-content-save 
        span {{ fileName }}
        v-spacer
        span {{ searchInput }}
        v-menu(offset-y='',:close-on-content-click="false")
          template(v-slot:activator='{ on, attrs }')
            v-btn(icon=''  v-bind='attrs' v-on='on')
              v-icon mdi-magnify
          v-card(style="max-width:30vw;min-width:30vw;overflow:hidden")
            v-row.pa-5
              v-text-field(
                v-model="searchInput" 
                append-icon="mdi-magnify" 
                label="Search String"
                disabled
              ) 
            div(v-if="EditorMode.CustomEditor === editorMode")
              v-divider   
              div(v-for="(prop,index) in props")
                CustomCheckbox(:label="prop" @update="setFilter(prop,index,$event)")
  Dialog
  v-row(v-if="EditorMode.MonacoEditor === editorMode")
    div(style="height:100vh;width:100%;" v-resize="onResize")
        monaco-editor-wrapper(
          :fileContent="fileContent"
          @update="onSaveMonacoEditor"
        )
  v-row(v-else-if="EditorMode.CustomEditor === editorMode")
      custom-editor(
        :jsonContent="jsonContent" 
        :filter="filter"
        :searchInput="searchInput" 
        @changed="onCustomEditorChanged"
      )
</template>
<script>
import MonacoEditor from 'monaco-editor-vue';
import MonacoEditorWrapper from './MonacoEditorWrapper.vue';
import CustomEditor from './CustomEditor.vue';
import Dialog from '@/components/CustomDialog.vue';
import CustomPath from '@/components/CustomPath.vue';
import CustomCheckbox from '@/components/Fields/CustomCheckbox.vue';
import { EditorMode } from '@/assets/data/Editor';

export default {
  name: "App",
  components: { 
    CustomCheckbox, 
    CustomPath, 
    CustomEditor, 
    MonacoEditor,
    MonacoEditorWrapper,
    Dialog 
  },
  data() {
    return {
      //Editor
      editorMode:-1,
      //Info About File
      fileName:'',
      fileContent: '',
      jsonContent: {},

      updatedFileContent:'',

      //Check if needed after rework
      isDirty: false,
      isCustomEditor: true,
      showMenu: false,
      showModded: true,
      customEditorValue: [],
      props: [],
      searchInput: '',
      filter: [],
    };
  },
  beforeCreate(){
    this.EditorMode = EditorMode
  },
  async  created() {
    /*
    Read the file into global variable
    find out which mode it is
    calculate the rights props for the choosen editor
    */
    this.key = this.$route.params.key;
    this.fileName = this.key.split('\\').slice(-1).join('');
    this.editorMode = this.$route.params.editor


    await this.loadFile()



    //todo make the top bar own component

  },
  async mounted() {
    document.addEventListener("keydown", this.doSave);
  },
  beforeDestroy() {
    document.removeEventListener("keydown", this.doSave);
  },
  methods: {
    backToFileviewer(){
      this.$router.pass('fileviewer',{key:this.key.split('\\').slice(0,-1).join('\\')})
    },
    editorMounted(value){
      this.editor = value
    },
    genContent(){
      let base = JSON.parse(this.fileContent)
      base.content = this.customEditorValue
      return  JSON.stringify(base, null, 2)
    },
    loadFile() {
      const rawRead = window.file.fs.readFileSync(this.key)
      this.fileContent = new TextDecoder().decode(rawRead);
      //todo show error that the file is malformatted
      this.jsonContent = JSON.parse(this.fileContent);
      console.log(this.fileContent)
      if (this.jsonContent && this.jsonContent.content) {
        this.props = Object.keys(this.jsonContent.content[0]);
      }
    },
    setEditor(mode){
      switch(mode){
        case EditorMode.MonacoEditor:
          break
        case EditorMode.CustomEditor:
          this.editorMode = mode
          break
      }
    },
    onChange(value) {
      this.isDirty=true
    },
    onCustomEditorChanged(val){
      this.isDirty=true
      this.customEditorValue=val
    },  
    onResize(value){
      this.editor.layout()
    },
    doSave(e) {
      //Todo rework the save system there are to many save methods here
      if (!(e.keyCode === 83 && e.ctrlKey)) {
        return;
      }

      this.onSave()
    }, 
    onSaveMonacoEditor(content){
      this.updatedFileContent = content
      this.isDirty =true
    },  
    onSave(){
      //WIP 
      const resetDirty = (err)=> {if(!err) this.isDirty = false}
      switch(this.editorMode){
        case EditorMode.MonacoEditor:
          window.file.fs.writeFile(this.key,this.updatedFileContent,err=>resetDirty(err))
          break
        case EditorMode.CustomEditor:
          window.file.fs.writeFile(this.key,this.genContent(),err=>resetDirty(err))
          this.genContent()
          break
      }
    },        
    setFilter(prop,index,val){
      this.$set(this.filter,index,{[prop]:val})
    }
  }
};
</script>

<style scoped>

.me {
    width:100%; height:100%; max-height:100% !important;
    margin:0; padding:0;
    overflow:hidden;
}
</style>