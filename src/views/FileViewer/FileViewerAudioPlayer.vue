<template lang="pug">
div(@drop.prevent='onDrop($event)' @dragover.prevent='dragover = true' @dragenter.prevent='dragover = true' @dragleave.prevent='dragover = false' :class="{ 'grey lighten-2': dragover }")
    v-row.d-flex.justify-center.ma-4
      v-icon( :style="genTransformScale(innerIconScale)") mdi-music
    v-row.d-flex.justify-center.ma-0
      span.text-truncate.text-caption(style="word-break: break-word") {{ innerFileName }}
    
    
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
    spectrumFolder:{
      type:String
    }
  },
  data() {
    return {
      innerIconScale: 1.3,
      innerFileName: '',
      dragover: false,
      file: null,
      imageUrl: null,
      uploadedFiles: [],
      maxLength:90,
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
      let ffmpeg = window.file.getSetting(SETTING.FFMPEG_PATH);
      if (!ffmpeg) {
        alert("Please set your ffmpeg path in the settings");
        return;
      }
      const file = files.dataTransfer.files[0];
      const inputFilePath = file.path;
      const outputFilePath = (inputFilePath.split(".").slice(0, -1).join(".") + ".ogg");
      const ffmpegPath = window.file.getSetting(SETTING.FFMPEG_PATH);

      const commandArgs = [
        '-y', '-ss', '0', '-t', this.maxLength, '-i', inputFilePath,
        '-map', '0:a:0', '-vn', '-codec:a', 'libvorbis', '-q:a', '5', `"${this.path}"`
      ];
      const command = `"${ffmpegPath}" ${commandArgs.join(" ")}`;
      if (file.type.includes("audio") || file.type.includes("video")) {
        if (file.type.includes("ogg")) {
          window.file.copy(inputFilePath, outputFilePath);
        } else {
          window.file.exec(command, (error, stdout, stderr) => {
            if (error) {
              // Todo error handling
            } else {
              this.saveSpectrum()
            }
          });
        }
      } else {
        alert(`File type not supported for conversion: ${file.type}`);
      }
      this.dragover=false
    },
    saveSpectrum(){
      if(!this.spectrumFolder) return
      let path = `${this.spectrumFolder}\\${this.innerFileName.split('.')[0]}.jet`
      path = path.replaceAll('\\','/')

      let spectrumMock = require('@/assets/data/EarWaxFrequency').EarWaxSpectrum
      window.file.fs.writeFile(path,JSON.stringify(spectrumMock),()=>{})
    }
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
      