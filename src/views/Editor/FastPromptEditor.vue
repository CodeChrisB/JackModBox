<template lang="pug">
v-row.ma-1.mt-0
  v-col.col-12.mt-0(
    ref="promptContainer"
  )
    row-text-area.mx-4(
      v-model="internalValue",
      @keydown="onKeyDown",
      flat
      :rows="rows"
      @input="onUpdate"
    )
    div(style="min-height:50px")
  </template>
      
<script>
import { CEErrors } from '@/assets/data/EditorValues'
import CustomField from '@/components/Fields/CustomField.vue'
import RowTextArea from '@/components/Fields/RowTextArea.vue'

export default {
  name: 'FastPromptEditor',
  components: {
    CustomField,
    RowTextArea
  },

  data() {
    return {
      rows: 1,
      internalJsonContent: '',
      internalValue: ''
    }
  },
  props: {
    jsonContent: {
      type: Object
    },
    jsonKey: {
      type: String,
    }
  },
  computed: {
    lines() {
      return this.internalValue.split("\n");
    }
  },
  created() {
    this.key = this.$route.params.key
  },
  mounted() {
    this.$nextTick(() => {
      const height = this.$refs.promptContainer.clientHeight;
      this.rows = Math.floor(height / 28)
      console.log(height, Math.floor(this.rows))

    })
  },
  methods: {
    onUpdate(e) {
      //
      //this.internalValue.content[e.index] = e.content
      let cleanUp = this.internalValue.split('\n')
      cleanUp = cleanUp.map(x => x.replaceAll('/n', '\n').substring(4))


      for (let i = 0; i < this.internalJsonContent.content.length - 1; i++) {
        console.log(i, this.jsonKey, this.internalValue.length)
        this.internalJsonContent.content[i][this.jsonKey] = cleanUp[i]
      }

      this.$emit('changed', this.internalJsonContent.content)
    },
    onKeyDown(event) {
  // Get the current cursor position and text content
  const startPos = event.target.selectionStart;
  const endPos = event.target.selectionEnd;
  const currentValue = this.internalValue;

  // Check if the user is trying to delete a line or at the end of a line
  if (event.keyCode === 8 || event.keyCode === 46) {
    const beforeValue = currentValue.substring(0, startPos);
    const afterValue = currentValue.substring(endPos);
    const beforeLines = beforeValue.split("\n");
    const currentLine = beforeLines[beforeLines.length - 1];
    const nextLine = currentValue.substring(0, endPos).split("\n").pop();
    console.log(endPos, currentLine.length)

    console.log(startPos)
    if (startPos <= 4 || currentLine.length <= 4 || nextLine === undefined || (endPos === currentLine.length && event.keyCode === 46)) {
      // Prevent deleting the line if it's empty, at the end of the text, or at the end of a line
      event.preventDefault();
      return false;
    }
  }
}
  },
  watch: {
    jsonContent: {
      handler(newVal) {
        if (this.jsonKey && newVal) {
          this.internalJsonContent = newVal
          let data = newVal.content.map((elem, index) => `[${index + 1}] ` + elem[this.jsonKey].replaceAll('\n', '/n'))
          this.rows = data.length
          console.log(data.join('\n'))
          this.internalValue = data.join('\n')
        }


      },
      immediate: true
    }
  }

}
</script>
<style scoped>
.container {
  min-width: 40%;
  max-width: 100px;
}

::v-deep .v-text-field__slot {
  max-height: 90vh;
}
</style>