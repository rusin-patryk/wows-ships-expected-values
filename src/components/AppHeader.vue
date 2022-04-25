<template>
    <v-app-bar
        app
    >
        <v-app-bar-title>WoWS Personal Rating</v-app-bar-title>
        <v-spacer />
        <v-switch
            v-model="$vuetify.theme.dark"
            class="mt-5 mr-4"
            label="Dark"
            persistent-hint
            @change="saveThemeState"
        ></v-switch>
        <v-btn
            outlined
            small
            href="https://mowe-wows-clan.eu"
            target="_blank"
        >
            <v-icon small class="mr-1">mdi-open-in-new</v-icon> MOWE Clan
        </v-btn>
    </v-app-bar>
</template>

<script>
export default {
    name: "AppHeader",
    methods: {
        saveThemeState() {
            localStorage.setItem('themeDark', this.$vuetify.theme.dark.toString());
        },
    },
};
</script>
