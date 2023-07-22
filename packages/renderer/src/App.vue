<script lang="ts" setup>
import SearchPlayer from './components/SearchPlayer.vue';
import SideBar from './components/SideBar.vue';
</script>

<template>
  <div class="container mx-auto">
    <div class="flex flex-row flex-wrap py-4">
      <SideBar />
      <main
        role="main"
        class="w-full sm:w-2/3 md:w-3/4 pt-1 px-2"
      >
        <router-view />

        <search-player />
      </main>
    </div>
  </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin: 60px auto;
  max-width: 700px;
}

fieldset {
  margin: 2rem;
  padding: 1rem;
}
</style>
