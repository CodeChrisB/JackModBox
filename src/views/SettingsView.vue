<template lang="pug">
div 
    v-col.col-6
        v-text-field(
            v-model="steamPath"
            label="SteamApps Folder"
            hint=`SteamLibrary  >  steamapps  >  common`
            append-outer-icon="mdi-content-save"
            @click:append-outer="file.setSetting(SETTING.STEAM_PATH,steamPath)"
        )
        v-text-field(
            v-model="modPath"
            label="Mods Folder"
            hint=`A folder to save & load your mods from`
            append-outer-icon="mdi-content-save"
            @click:append-outer="file.setSetting(SETTING.MODS_PATH,modPath)"
        )

    span hello
</template>

<script>
import { SETTING } from '@/assets/data/SettingData';
export default {
    name: 'SettingsView',
    created(){
        SETTING.SettingsPath    
        this.file = window.file
        this.SETTING = SETTING
        this.getData()
    },  
    methods:{
        getData(){
            this.steamPath = this.file.getSetting(SETTING.STEAM_PATH)
            this.modPath = this.file.getSetting(SETTING.MODS_PATH)
        }
    },
    data() {
        return {
            steamPath: "",
            modPath:""
        }
    },

}
</script>
