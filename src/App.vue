<template>
    <v-app id="app">
        <app-header />
        <v-main>
            <v-container class="pt-6 pb-6">
                <router-view />
            </v-container>
        </v-main>
    </v-app>
</template>

<script>
import AppHeader from '@/components/AppHeader';

export default {
    name: "App",
    components: {
        AppHeader,
    },
    beforeMount() {
        this.$vuetify.theme.dark = localStorage.getItem('themeDark') !== 'false';
    },
};
</script>
