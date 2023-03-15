<template lang="pug">
div
  v-img(:src="imageUrl" alt="User Image")

</template>

<script>
export default {
  props: {
    path: {
      type: String,
      required: true
    }
  },
  computed: {
    imageUrl() {
      const fs = window.file.fs;
      const imageData = fs.readFileSync(this.path);
      return URL.createObjectURL(new Blob([imageData], {type: "image/png"}));
    }
  }
}
</script>
