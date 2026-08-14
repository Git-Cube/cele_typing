<template>
  <div class="app-container">
    <Header v-if="route.meta.showHeader !== false" />
    <router-view />
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import Header from './components/Header.vue'

const route = useRoute()
</script>

<style scoped lang="scss">
.app-container {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
}
</style>
