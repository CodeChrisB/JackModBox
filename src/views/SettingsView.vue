<template lang="pug">
div 
    v-col.col-6
        v-text-field(
            v-model="settings[SETTING.STEAM_PATH]"
            label="SteamApps Folder"
            hint=`SteamLibrary  >  steamapps  >  common`
            append-outer-icon="mdi-content-save"
            @click:append-outer="file.setSetting(SETTING.STEAM_PATH,settings[SETTING.STEAM_PATH])"
        )
        v-text-field(
            v-model="settings[SETTING.MODS_PATH]"
            label="Mods Folder"
            hint=`A folder to save & load your mods from`
            append-outer-icon="mdi-content-save"
            @click:append-outer="file.setSetting(SETTING.MODS_PATH,settings[SETTING.MODS_PATH])"
        )
        v-checkbox(
            v-model="settings[SETTING.SHOW_ALL_NO_PACKS]"
            label="Show all Games without Packs (requires restart currently)"
            @change="file.setSetting(SETTING.SHOW_ALL_NO_PACKS,settings[SETTING.SHOW_ALL_NO_PACKS])"
        )

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
            this.settings = this.file.getSetting()
        }
    },
    data() {
        return {
            settings:{}
        }
    },

}
</script>
