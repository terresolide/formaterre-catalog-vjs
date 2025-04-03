<script setup lang="ts">
// import { ref } from 'vue'
import { useRoute, RouterLink, RouterView } from 'vue-router'
import {useConfig} from '@/stores/config'
import {useCatalog} from '@/stores/catalog'
// import { useI18n } from "vue-i18n";
// import { loadLocaleMessages } from './i18n'
const config = useConfig()
config.init()
const catalog = useCatalog()
catalog.init()

const route = useRoute()
// const i18n = useI18n()
// loadLocaleMessages(i18n, 'en')
// const primary = ref(config.state.primary)

// Ajouter authentification et un store user
</script>

<template>
  <header>

    <div class="wrapper">
      <div style="text-align:right;">
        <a><font-awesome-icon icon="fa-solid fa-user" /> {{ $t('login') }}</a>
      </div>
      <nav>
        <!--<div class="test" :style="{background: primary}">machin</div>-->
        <div>
        <RouterLink style="padding-right:0;" to="/" >{{$t('catalog', 10)}}</RouterLink><template v-if="route.params.id"> / {{route.params.id}}</template>
      </div>
      <div style="text-align:center;width:calc(100% - 300px);">
        <template v-if="route.params.id">
          <RouterLink :to="{name: 'catalog-map', id: route.params.id}"><font-awesome-icon icon="fa-solid fa-map" /> Vue Carte</RouterLink>
          <RouterLink :to="{name: 'catalog-grid', id: route.params.id}"><font-awesome-icon icon="fa-solid fa-grip" /> Vue Grille</RouterLink>
          <RouterLink :to="{name: 'catalog-search', id: route.params.id}"><font-awesome-icon icon="fa-solid fa-magnifying-glass" /> Recherche textuelle</RouterLink>
        </template>
        <template v-else>
          <RouterLink to="/map"><font-awesome-icon icon="fa-solid fa-map" /> Vue Carte</RouterLink>
          <RouterLink to="/grid"><font-awesome-icon icon="fa-solid fa-grip" /> Vue Grille</RouterLink>
          <RouterLink to="/search"><font-awesome-icon icon="fa-solid fa-magnifying-glass" /> Recherche textuelle</RouterLink>
        </template>
      </div>
      
      </nav>
    </div>
  </header>

  <RouterView />
</template>

<style scoped>
.capitelize::first-letter {
  text-transform:uppercase;
}
header {
  line-height: 1.5;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align:left;
  margin-top: 0rem;
}
nav > div {
  display: inline-block;
}
nav > div:first-child {
  width:max-content;
}
nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
 
  .logo {
    margin: 0 2rem 0 0;
  }

 

  nav {
    text-align: center;
    margin-left: -1rem;
    font-size: 1rem;

    padding:0;
    margin-top: 0;
  }
}
</style>
