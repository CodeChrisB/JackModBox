<template lang="pug">
div 
    v-card(
        flat,
        )
        v-tabs(v-model='tab' background-color='primary')
            v-tab(key="setting")
                | Settings
            v-tab(key="update")
                | Updates
            v-tab(key="about")
                | About
        v-tabs-items(
            v-model='tab'
            style="max-height:85vh"
        ).overflow-y-auto
            v-tab-item(key="setting")
                v-card(flat='')
                    v-card-text 
                        v-col.col-6
                            v-text-field(
                                v-model="settings[SETTING.STEAM_PATH]"
                                label="SteamApps Folder"
                                hint=`SteamLibrary  >  steamapps  >  common`
                                append-outer-icon="mdi-content-save"
                                @click:append-outer="file.setSetting(SETTING.STEAM_PATH,settings[SETTING.STEAM_PATH]).then(()=>$broadcast('reloadSideview',true))"
                            )
                            v-text-field(
                                v-model="settings[SETTING.MODS_PATH]"
                                label="Mods Folder"
                                hint=`A folder to save & load your mods from`
                                append-outer-icon="mdi-content-save"
                                @click:append-outer="file.setSetting(SETTING.MODS_PATH,settings[SETTING.MODS_PATH]).then(()=>$broadcast('reloadSideview',true))"
                            )
                            v-text-field(
                                v-model="settings[SETTING.FFMPEG_PATH]"
                                label="Path to ffmpeg.exe"
                                hint=`A folder to save & load your mods from`
                                append-outer-icon="mdi-content-save"
                                hide-details
                                @click:append-outer="file.setSetting(SETTING.FFMPEG_PATH,settings[SETTING.FFMPEG_PATH])"
                            )
                            a(@click="openPage()") Download the latest ffmpeg binary
                            v-checkbox(
                                v-model="settings[SETTING.SHOW_ALL_NO_PACKS]"
                                label="Show all Games without Packs"
                                @change="file.setSetting(SETTING.SHOW_ALL_NO_PACKS,settings[SETTING.SHOW_ALL_NO_PACKS]).then(()=>$broadcast('reloadSideview',true))"
                            )

            v-tab-item(key="update")
                v-card(flat='')
                    v-card-text 
                        v-row
                            span Current Version v0.1.1
                        v-row
                            v-btn() Check For Update
            v-tab-item(key="about")
                v-card(flat='')
                    v-card-text 
                        span.text-h4 About this tool
                        v-col.col-8
                            span {{aboutText}}
                        v-divider
                        span.text-h4 Documentation
                        v-col.col.col-8 
                            span {{ docText }}
                        v-btn(
                            @click="toDocumenation()"
                        )| View Documenation
            

        

</template>

<script>
import { SETTING } from '@/assets/data/SettingData';
export default {
    name: 'SettingsView',
    created() {
        SETTING.SettingsPath
        this.file = window.file
        this.SETTING = SETTING
        this.getData()
    },
    methods: {
        getData() {
            this.settings[SETTING.MODS_PATH] = this.file.getSetting(SETTING.MODS_PATH)
            this.settings[SETTING.STEAM_PATH] = this.file.getSetting(SETTING.STEAM_PATH)
            this.settings[SETTING.FFMPEG_PATH] = this.file.getSetting(SETTING.FFMPEG_PATH)
            this.settings[SETTING.SHOW_ALL_NO_PACKS] = this.file.getSetting(SETTING.SHOW_ALL_NO_PACKS)
        },
        openPage() {
            window.file.openInBrowser('https://ffbinaries.com/downloads')
        },
        toDocumenation() {
            this.$broadcast("documentation-state", true)
            this.$router.replace('/Documenation')
        }
    },
    data() {
        return {
            aboutText: 'This is an open-source modding tool designed for modifying Jackbox games. Please note that this tool is not an official Jackbox tool and is not affiliated with the developers of Jackbox in any way. This third-party tool has been created to allow users to mod Jackbox games according to their preferences. Its intuitive interface makes it easy to use and enables users to access advanced modding features with ease. We believe that this modding tool will enable users to customize their Jackbox game experience and make it even more enjoyable. We hope that you find this tool useful and that it enhances your Jackbox game experience.',
            docText: 'For further questions regarding JackModBox, please consult the documentation for detailed information on the tools features and functionalities. If you still have questions or concerns after reviewing the documentation, feel free to open an Issue on Gihub.',
            settings: {},
            tab: null,
        }
    },

}
</script>
