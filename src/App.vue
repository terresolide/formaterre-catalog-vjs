<script setup lang="ts">
import {computed, onMounted, watch } from 'vue'
import { useRoute, RouterLink, RouterView } from 'vue-router'
import {useConfig} from '@/stores/config'
import {useCatalog} from '@/stores/catalog'
import UserInfo from '@/components/UserInfo.vue'
const config = useConfig()
config.init()
const catalog = useCatalog()
catalog.init()

const route = useRoute()
watch(route, () => {
    catalog.setCatalog(route.params.catalog)
})
onMounted(() => {
    catalog.setCatalog(route.params.catalog)
})
let currentCatalog = computed(() => { 
    return catalog.getCurrent()
})
// Ajouter authentification et un store user
</script>

<template>
    <template v-if="route.name !== 'login'">
        <header>
            
            <div class="wrapper">
              <user-info />
              <nav>
                <div>
                <RouterLink style="padding-right:0;" to="/" >{{$t('catalog', 10)}}</RouterLink>
                <template v-if="currentCatalog"> / 
                <img :src="config.state.api + '/images/harvesting/' + currentCatalog.logo" height="25" style="vertical-align:middle;" > {{currentCatalog.name}}</template>
              </div>
              <div style="text-align:center;width:calc(100% - 300px);">
                <template v-if="route.params.catalog">
                  <RouterLink :to="{name: 'catalog-map', catalog: route.params.catalog.toLowerCase()}"><font-awesome-icon icon="fa-solid fa-map" /> {{$t('map_view')}}</RouterLink>
                  <RouterLink :to="{name: 'catalog-grid', catalog: route.params.catalog.toLowerCase()}"><font-awesome-icon icon="fa-solid fa-grip" /> {{$t('grid_view')}}</RouterLink>
                  <RouterLink :to="{name: 'catalog-search', catalog: route.params.catalog.toLowerCase()}"><font-awesome-icon icon="fa-solid fa-magnifying-glass" /> {{$t('text_search')}}</RouterLink>
                </template>
                <template v-else>
                  <RouterLink to="/map"><font-awesome-icon icon="fa-solid fa-map" /> {{$t('map_view')}}</RouterLink>
                  <RouterLink to="/grid"><font-awesome-icon icon="fa-solid fa-grip" /> {{$t('grid_view')}}</RouterLink>
                  <RouterLink to="/search"><font-awesome-icon icon="fa-solid fa-magnifying-glass" /> {{$t('text_search')}}</RouterLink>
                </template>
              </div>
              
              </nav>
            </div>
        </header>
  </template>
  <RouterView />
</template>
<style>
  .clipboard-tooltip {
  position: absolute;
  display:none;
  background-color: #fafafa;
  border: 1px solid #a3a3a3;
  font-size: smaller;
  line-height:1;
  text-align:left;
  padding: 5px;
  cursor: pointer;
  width: 150px;
  box-shadow: 2px 2px 3px rgba(0, 0, 0, 0.4);
  z-index:1;
}
.tooltip-show + .clipboard-tooltip {
  display:block;
}

</style>
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
