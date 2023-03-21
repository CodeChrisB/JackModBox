<template lang="pug">
  div(style="overflow-y:scroll").mt-1
    v-row.mt-1.pl-2
      v-card(style="width:100%;padding:3px;background-color:#0078d7")
        div(style="max-width:95%;display: flex; align-items: center;")
          v-btn.ml-4(icon @click="backToFileviewer")
            v-icon mdi-arrow-left
          v-icon(v-if="!isCustomEditor" @click="showModded=!showModded") {{ showModded ? 'mdi-check-all' : 'mdi-card-remove' }}
          v-icon(medium).mr-2(@click="onSwitchModes") {{ isCustomEditor ? 'mdi-form-select' : 'mdi-book-open'}}
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
                v-text-field(v-model="searchInput" append-icon="mdi-magnify" label="Search String") 
              div(v-if="!isCustomEditor")
                v-divider   
                div(v-for="(prop,index) in props")
                  CustomCheckbox(:label="prop" @update="setFilter(prop,index,$event)")
    v-row
      div(style="height:100vh;width:100%;" v-resize="onResize")
        Dialog
        MonacoEditor.me(v-show="isCustomEditor" theme="vs-dark" language="json" automaticLayout: true :options="options" @change="onChange" :editorMounted="editorMounted")
        CustomEditor(
          v-show="!isCustomEditor" 
          :jsonFile="jsonFile" 
          :filter="filter"
          :ceMode="ceMode"
          :searchInput="searchInput" 
          @error="onCustomEditorError" 
          @changed="onCustomEditorChanged"
        )
</template>
<script>
import MonacoEditor from 'monaco-editor-vue';
import CustomEditor from './CustomEditor.vue';
import Dialog from '@/components/CustomDialog.vue';
import CustomPath from '@/components/CustomPath.vue';
import CustomCheckbox from '@/components/Fields/CustomCheckbox.vue';

export default {
  name: "App",
  components: { CustomCheckbox, CustomPath, CustomEditor, MonacoEditor, Dialog },
  created() {
    this.file = window.file;
    this.key = this.$route.params.key;
    this.fileName = this.key.split('\\').slice(-1).join('');
    this.checkMode();
  },
  async mounted() {
    document.addEventListener("keydown", this.doSave);
  },
  beforeDestroy() {
    document.removeEventListener("keydown", this.doSave);
  },
  data() {
    return {
      ceMode:'',
      fileContent: '',
      isDirty: false,
      isCustomEditor: true,
      showMenu: false,
      showModded: true,
      customEditorValue: [],
      jsonFile: {},
      props: [],
      searchInput: '',
      filter: [],
      options: {
        editor: null,
        value: "Loading File..."
        //Monaco Editor Options
      }
    };
  },
  methods: {
    backToFileviewer(){
      this.$router.pass('fileviewer',{key:this.key.split('\\').slice(0,-1).join('\\')})
    },
    checkMode(){
      if(this.$route.params.customEditor){
        this.setCustomEditor()
        this.ceMode = this.$route.params.ceMode
      }else{
        this.setMonacoEditor()
      }
      console.log('isCustomEditor',this.$route.params.customEditor)
      
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
      return new Promise((resolve, reject) => {
        this.file.fs.readFile(this.key, (error, text) => {
          if (error) {
            reject(error);
          } else {
            this.fileContent = new TextDecoder().decode(text);
            let json = JSON.parse(this.fileContent);
            if (json && json.content) {
              this.props = Object.keys(json.content[0]);
            }
            resolve();
          }
        });
      });
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
    onCustomEditorError(e){
      this.onSwitchModes()
    },
    onSave(){ 
      if(!this.isCustomEditor && !!this.customEditorValue  && this.customEditorValue.lengthy<0) return
      this.file.fs.writeFile(this.key,this.isCustomEditor ? this.editor.getValue() : this.genContent(), error => {
        if(!error) this.isDirty = false
        
      })
    },
    onSwitchModes(){
      if(this.isCustomEditor){
        this.setMonacoEditor()
      }else{
        this.setCustomEditor()
      }
    },
    setCustomEditor(){
      this.isCustomEditor = true;
      this.loadFile().then(() => {
        this.jsonFile = JSON.parse(this.fileContent);
        this.customEditorValue = this.jsonFile.content;
        this.showModded=false;
        this.filter = this.props.map(() => true);
      });
    },
    setMonacoEditor(){
      this.isCustomEditor=false
      this.loadFile().then(()=>{
        this.editor.getModel().setValue(this.fileContent);
      })
        
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