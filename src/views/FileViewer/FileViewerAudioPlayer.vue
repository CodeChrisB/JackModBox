<template lang="pug">
  div(@drop.prevent='onDrop($event)' @dragover.prevent='dragover = true' @dragenter.prevent='dragover = true' @dragleave.prevent='dragover = false' :class="{ 'grey lighten-2': dragover }")
    div(
      v-if="dragover === false"
    )
      v-row.d-flex.justify-center.ma-4
        v-icon( :style="genTransformScale(innerIconScale)") mdi-music
      v-row.d-flex.justify-center.ma-0
        span.text-truncate.text-caption(style="word-break: break-word") {{ innerFileName }}
    v-card-text(v-else)
      v-row.d-flex.flex-column(dense='' align='center' justify='center')
        v-icon(:class="[dragover ? 'mt-2, mb-6' : 'mt-5']" size='60')
          | mdi-cloud-upload
        p
          | Drop your file(s) here, or click to select them.
      
      
      </template>
      
  <script>
  import { SETTING } from '@/assets/data/SettingData';
  
  export default {
    name: 'FileViewerAudioPlayer',
    props: {
      fileName: {
        type: String,
        required: true
      },
      iconScale: {
        type: Number,
        default: 1.3
      },
      path: {
        type: String,
        required: true
      },
    },
    data() {
      return {
        innerIconScale: 1.3,
        innerFileName: '',
        dragover: false,
        file: null,
        imageUrl: null,
        uploadedFiles: []
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
      onDrop(files) {
        let ffmpeg = window.file.getSetting(SETTING.FFMPEG_PATH)
        if(!ffmpeg){
          alert('Please set your ffmpeg path in the settings')
          return
        }
        const file = files.dataTransfer.files[0];
  
        if (file.type.includes("audio") ||file.type.includes('video') ) {
          const inputFilePath = file.path;
          const outputFilePath = (inputFilePath.split('.').slice(0,-1).join('.')+".ogg")
          const ffmpegPath = window.file.getSetting(SETTING.FFMPEG_PATH)
          const ffmpegCommand = `"${ffmpegPath}" -y -i "${inputFilePath}" -codec:a libvorbis -q:a 5 "${this.path}"`;
          debugger
          window.file.exec(ffmpegCommand, (error, stdout, stderr) => {
            if (error) {
             //todo add info for user
            } else {
            }
          });
        }
      },
    },
    watch: {
      fileName: {
        handler(newVal) {
          this.innerFileName = newVal
        },
        immediate: true
      },
      iconScale: {
        handler(newVal) {
          this.innerIconScale = newVal
        },
        immediate: true
      },
      path: {
        handler(newVal) {
          this.innerPath = newVal
        },
        immediate: true
      }
    }
  }
  </script>
      