<template lang="pug">
div(style="min-width:40vw")
  v-row.ma-2.pt-3.mr-0.d-flex
    v-icon.align-start(large) mdi-music
    span.pl-3.text-h6 File : {{ data.name }}


  v-row.ma-3
    span(style="max-width:80%") {{ data.fullPath }}
    v-spacer
    v-icon(x-large @click="yt.tab =!yt.tab")  mdi-youtube
    v-icon(x-large  @click="playAudio")  mdi-chevron-right-circle-outline

  v-divider
  v-row.ma-3(v-if="yt.tab")
    v-col.col-6.ma-0.pa-0
      v-text-field(
        v-model="yt.url"
        label="Url of the Sound Effect"
      )
    v-spacer
    v-btn.ma-4(
      @click="replaceAudio"
      :disabled="!isValidYoutubeUrl(yt.url)"
      color="primary"
    ) Replace Audio
      
      
</template>
      
<script>
export default {
  name: 'FileViewerAudioPlayer',
  props: {
    data: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      dragover: false,
      file: null,
      yt:{
        tab:false,
        url:''
      }
    }
  },
  created() {
    this.innerPath = this.path
  },
  computed: {

  },
  methods: {
    closeDialog() {
      this.$emit("update:dialog", false);
    },
    genTransformScale(scale) {
      return `transform:scale(${scale})`
    },
    isValidYoutubeUrl(url) {
    if(url==='')return false
    // Regular expression to match valid YouTube URLs
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/;

    if (youtubeRegex.test(url)) {
      // If the URL is a YouTube video, return true
      if (url.includes("/watch?v=")) {
        return true;
      }
      return false;
    }

    return false;
  },
    async onDrop(e) {
      this.dragover = false;
      if (e.dataTransfer.files.length > 0) {
        // window.file.overwriteFile(this.path, e.dataTransfer.files[0].path).then(suceed => {
        //   this.getImage()
        // })
      }
    },
    replaceAudio(){
      console.log('WIP Download and convert YT Video')
    },
    playAudio(){
      window.file.playSound(this.data.fullPath)
    }
  },
  watch: {
    data: {
      handler(newVal) {
        this.innerFileName = newVal
      },
      immediate: true
    },
  }
}
</script>
      