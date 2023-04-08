<template lang="pug">
v-card(
    @drop.prevent='onDrop($event)' 
    @dragover.prevent='dragover = true' 
    @dragenter.prevent='dragover = true' 
    @dragleave.prevent='dragover = false' 
    :class="(dragover ? 'elevation-4' : 'elevation-0')"
  )
  v-img(
    :src="imageUrl" alt="User Image"
    :style="internalViewMode"
  )
    
    
    </template>
    
  <script>
  export default {
    props: {
      path: {
        type: String,
        required: true
      },
      index:{
        type:Number,
        required:true
      },
      indexToReload:{
        type:Number
      },
      viewMode:{
        type:Number
      }
    },
    data() {
      
      return {
        dragover: false,
        file: null,
        imageUrl: null,
        internalViewMode:'',
        selectedFile: null,
        uploadedFiles: []
      }
    },
    created() {
      this.innerPath = this.path
      this.getImage()

      this.$listen('onReplace',)
    },
    computed: {
  
    },
    methods: {
      closeDialog() {
        this.$emit("update:dialog", false);
      },
      async onDrop(e) {
        this.dragover = false;
        //Replace Images
        if(e.dataTransfer.files.length===1) {
          this.overrideImage(e.dataTransfer.files[0].path)
        } else if( e.dataTransfer.files.length>1){
          this.$emit('massReplace',Object.values(e.dataTransfer.files).map(x=>x.path))
        }

      },
      getImage() {
        const fs = window.file.fs;
        const imageData = fs.readFileSync(this.innerPath);
        if (!imageData) return
        this.imageUrl = URL.createObjectURL(new Blob([imageData], { type: "image/png" }));
      },
      overrideImage(path){
        window.file.overwriteFile(this.path, path).then(suceed => {
            this.getImage()
          })
      },
      saveBas64Image(image) {
        window.file.replaceFileWithBase64(this.path, image, (err) => { this.getImage() })
      },
      saveUrl(url) {
        window.file.downloadImageAsBase64(url).then(base64 => {
          this.saveBas64Image(base64)
        })
      }
    },
    watch:{
      path:{
        handler(newVal){
          this.innerPath = newVal
          this.getImage()
        },
        immediate:true  
      },
      indexToReload:{
        handler(newVal){
          if(this.index === newVal) this.getImage()
        }
      },
      viewMode:{
        handler(newVal){
          this.internalViewMode = newVal
        },
        immediate:true
      }
    }
  }
  </script>
    