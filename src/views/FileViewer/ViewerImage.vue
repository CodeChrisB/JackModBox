<template lang="pug">
v-card(@drop.prevent='onDrop($event)' @dragover.prevent='dragover = true' @dragenter.prevent='dragover = true' @dragleave.prevent='dragover = false' :class="{ 'grey lighten-2': dragover }")
  v-img(
    v-if="dragover === false"
    :src="imageUrl" alt="User Image"
  )
  v-card-text(v-else)
    v-row.d-flex.flex-column(dense='' align='center' justify='center')
      v-icon(:class="[dragover ? 'mt-2, mb-6' : 'mt-5']" size='60')
        | mdi-cloud-upload
      p
        | Drop your file(s) here, or click to select them.


</template>

<script>
export default {
  props: {
    path: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      dragover: false,
      file: null,
      imageUrl: null,
      selectedFile: null,
      uploadedFiles: []
    }
  },
  created() {
    this.innerPath = this.path
    this.getImage()
  },
  computed: {

  },
  methods: {
    closeDialog() {
      this.$emit("update:dialog", false);
    },
    onDrop(e) {
      this.dragover = false;
      if (e.dataTransfer.files.length > 1) {
      } else {
        console.log(e.dataTransfer.files[0])
        window.file.overwriteFile(this.path, e.dataTransfer.files[0].path).then(suceed => {
          this.getImage()
        })

      }


    },
    getImage() {
      const fs = window.file.fs;
      const imageData = fs.readFileSync(this.innerPath);
      if (!imageData) return
      this.imageUrl = URL.createObjectURL(new Blob([imageData], { type: "image/png" }));
    }
  }
}
</script>
