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
  export default {
    name:'FileViewerAudioPlayer',
    props: {
      fileName:{
        type:String,
        required:true
      },
      iconScale:{
        type:Number,
        default:1.3
      },  
      path: {
        type: String,
        required: true
      },
    },
    data() {
      return {
        innerIconScale:1.3,
        innerFileName:'',
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
      genTransformScale(scale){
        return `transform:scale(${scale})`
      },
      async onDrop(e) {
        this.dragover = false;
        if (e.dataTransfer.files.length > 0) {
          // window.file.overwriteFile(this.path, e.dataTransfer.files[0].path).then(suceed => {
          //   this.getImage()
          // })
        }
      },
    },
    watch:{
      fileName:{
        handler(newVal){
          this.innerFileName = newVal
        },
        immediate:true
      },
      iconScale:{
        handler(newVal){
          this.innerIconScale = newVal
        },      
        immediate:true  
      },  
      path:{
        handler(newVal){
          this.innerPath = newVal
        },
        immediate:true  
      }
    }
  }
  </script>
    