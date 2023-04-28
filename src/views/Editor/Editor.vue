<template lang="pug">
div.overflow-y-hidden.overflow-x-hidden
  v-row(style="max-height:5vh").mt-1.pl-2
    v-card(style="width:100%;padding:3px;background-color:#0078d7")
      div(style="max-width:95%;display: flex; align-items: center;")
        v-btn.ml-4(icon @click="backToFileviewer")
          v-icon mdi-arrow-left
        v-icon(v-if="!atomicEditor && !isCustomEditor" @click="showModded=!showModded") {{ showModded ? 'mdi-check-all' : 'mdi-card-remove' }}
        v-icon(v-if="!atomicEditor" medium).mr-2(@click="setEditor(EditorMode.CustomEditor)") {{ isCustomEditor ? 'mdi-form-select' : 'mdi-book-open'}}
        v-btn.mr-1(icon medium :disabled="!isDirty" @click="onSave")
          v-icon(v-if="!atomicEditor" medium) mdi-content-save 
        span {{ fileName }}
        v-spacer
        span {{ searchInput }}
        v-menu(offset-y='',:close-on-content-click="false")
          template(v-slot:activator='{ on, attrs }')
            v-btn(icon=''  v-bind='attrs' v-on='on')
              v-icon mdi-magnify
          v-card(style="max-width:30vw;min-width:30vw;overflow:hidden")
            v-row.pa-5
              span {{ filter }}
              v-text-field(
                v-model="searchInput" 
                append-icon="mdi-magnify" 
                label="Search String"
                disabled
              ) 
            div(v-if="EditorMode.CustomEditor === editorMode")
              v-divider 
              div(v-for="(prop,index) in props")
                CustomCheckbox(
                  :val="filter[index][prop]"
                  :label="prop" @update="setFilter(prop,index,$event)"
                )
  Dialog
  v-row(v-if="EditorMode.MonacoEditor === editorMode").parent
    div.editor.overflow-y-hidden
        monaco-editor-wrapper(
          :fileContent="fileContent"
          @update="onSaveMonacoEditor"
        )
  v-row.parent.pb-4.mb-4(
    v-else-if="EditorMode.CustomEditor === editorMode"
    style="min-width:100%"
    )
      custom-editor(
        :jsonContent="jsonContent" 
        :filter="filter"
        :searchInput="searchInput" 
        :editorValues="editorValues"
        @changed="onCustomEditorChanged"
      )
  v-row(v-else-if="EditorMode.FastPromptEditor === editorMode")
    FastPromptEditor(
      :jsonContent="jsonContent"
      :jsonKey="editorValues.key"
      @changed="onCustomEditorChanged"
    )
  v-row(v-else-if="EditorMode.AudioPromptEditor === editorMode")
    AudioPromptEditor(
      :data="editorValues"
    )
  v-row(v-else-if="EditorMode.SWFEditor === editorMode")
    SWFEditor(
      :filePath="key"
    )

</template>
<script>
import { EditorMode } from "@/assets/data/Editor";
import AudioPromptEditor from "./AudioPromptEditor.vue";
import CustomCheckbox from "@/components/Fields/CustomCheckbox.vue";
import CustomEditor from "./CustomEditor.vue";
import CustomPath from "@/components/CustomPath.vue";
import Dialog from "@/components/CustomDialog.vue";
import FastPromptEditor from "./FastPromptEditor.vue";
import MonacoEditor from "monaco-editor-vue";
import MonacoEditorWrapper from "./MonacoEditorWrapper.vue";
import SWFEditor from "./SWFEditor.vue";
import { Code } from "@/assets/data/BusCode";

export default {
  name: "App",
  components: {
    AudioPromptEditor,
    CustomCheckbox,
    CustomEditor,
    CustomPath,
    Dialog,
    FastPromptEditor,
    MonacoEditor,
    MonacoEditorWrapper,
    SWFEditor,
  },
  data() {
    return {
      //Editor
      editorMode: -1,
      atomicEditor:false,
      //Info About File
      fileName: "",
      fileContent: "",
      jsonContent: {},

      updatedFileContent: "",
      nodeIdCounter: 0,
      //Check if needed after rework
      isDirty: false,
      isCustomEditor: true,
      showMenu: false,
      showModded: true,
      customEditorValue: [],
      props: [],
      searchInput: "",
      filter: [],
    };
  },
  beforeCreate() {
    this.EditorMode = EditorMode;
  },
  async created() {
    /*
    Read the file into global variable
    find out which mode it is
    calculate the rights props for the choosen editor
    */

    this.$broadcast(Code.SetToggleSideView, false);

    if (this.$route.params.key) {
      this.key = this.$route.params.key;
      this.fileName = this.key.split("\\").slice(-1).join("");
    }
    this.editorMode = this.$route.params.editor;
    this.editorValues = this.$route.params.editorValues;
    this.setIconDrawer();
    let self = this;
    this.$listen(Code.EditorFormatCode, () => self.cleanJson());



    //set filter from tree data
    this.setCustomFilter(this.$route.params?.editorValues?.ccstate)

    //Editors that handle load and save action itself due to complications
    this.atomicEditor = [
      EditorMode.SWFEditor,
      EditorMode.AudioPromptEditor,
    ].includes(this.editorMode);
    if (this.atomicEditor) return;
    await this.loadFile();

    //todo make the top bar own component
  },
  async mounted() {
    document.addEventListener("keydown", this.doSave);
  },
  beforeDestroy() {
    document.removeEventListener("keydown", this.doSave);
  },
  computed: {
    genContent() {
      let base = JSON.parse(this.fileContent);
      base.content = this.customEditorValue;
      return JSON.stringify(base, null, 2);
    },
  },
  methods: {
    getAllKeys(jsonData) {
      const keys = new Set();

      function traverse(obj, parentKey) {
        if (typeof obj !== "object" || obj === null) {
          return;
        }

        for (const key in obj) {
          if (Object.hasOwnProperty.call(obj, key)) {
            const currentKey = Array.isArray(obj) ? parentKey : key;
            keys.add(currentKey);
            traverse(obj[key], currentKey);
          }
        }
      }

      traverse(jsonData, "");

      return Array.from(keys);
    },
    backToFileviewer() {
      this.$router.pass("fileviewer", {
        key: this.key.split("\\").slice(0, -1).join("\\"),
      });
      this.$broadcast(Code.SetToggleSideView, true);
    },
    cleanJson() {
      try {
        this.fileContent = JSON.stringify(
          JSON.parse(this.fileContent),
          null,
          2
        );
      } catch (ex) {}
    },
    editorMounted(value) {
      this.editor = value;
    },
    loadFile() {
      const rawRead = window.file.fs.readFileSync(this.key);
      this.fileContent = new TextDecoder().decode(rawRead);
      //todo show error that the file is malformatted
      try {
        this.jsonContent = JSON.parse(this.fileContent);
        if (this.jsonContent && this.jsonContent.content) {
          this.props = this.getAllKeys(this.jsonContent.content[0]);
        }
      } catch (ex) {
        this.jsonContent = {};
      }
    },
    setEditor(mode) {
      switch (mode) {
        case EditorMode.MonacoEditor:
          break;
        case EditorMode.CustomEditor:
          this.editorMode = mode;
          break;
      }
    },
    onChange(value) {
      this.isDirty = true;
    },
    onCustomEditorChanged(val) {
      this.isDirty = true;
      this.customEditorValue = val;
    },
    doSave(e) {
      //Todo rework the save system there are to many save methods here
      if (!(e.keyCode === 83 && e.ctrlKey)) {
        return;
      }

      this.onSave();
    },
    onSaveMonacoEditor(content) {
      this.updatedFileContent = content;
      this.isDirty = true;
    },
    onSave() {
      //WIP
      const resetDirty = (err) => {
        if (!err) this.isDirty = false;
      };
      switch (this.editorMode) {
        case EditorMode.MonacoEditor:
          window.file.fs.writeFile(this.key, this.updatedFileContent, (err) =>
            resetDirty(err)
          );
          break;
        case EditorMode.CustomEditor:
        case EditorMode.FastPromptEditor:
          window.file.fs.writeFile(this.key, this.genContent, (err) =>
            resetDirty(err)
          );
          break;
      }
    },
    setCustomFilter(data){
      this.$set(this, 'filter',data);
    },
    setFilter(prop, index, val) {
      this.$set(this.filter, index, { [prop]: val });
    },
    setIconDrawer() {
      let icons = [];

      icons.push({
        icon: "mdi-format-color-highlight",
        callee: Code.EditorFormatCode,
        hint: "Format the text",
      });

      this.$broadcast(Code.SetIconDrawerContent, icons);
    },
  },
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
.parent {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.editor {
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
}
</style>
