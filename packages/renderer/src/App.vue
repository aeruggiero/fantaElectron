<script lang="ts" setup>
import SideBar from './components/SideBar.vue';
</script>

<template>
  <div class="w-full flex flex-col sm:flex-row flex-wrap sm:flex-nowrap flex-grow">
    <SideBar />
    <main
      role="main"
      class="w-full sm:w-2/3 md:w-3/4 pt-1 px-2"
    >
      <router-view v-slot="{Component}">
        <Transition
          name="fade"
          mode="out-in"
        >
          <Component :is="Component" />
        </Transition>
      </router-view>
    </main>
  </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

fieldset {
  margin: 2rem;
  padding: 1rem;
}
.fade-enter-from,
.fade-leave-to {
  position: absolute;
  opacity: 0;
}
.fade-enter-active,
.fade-leave-active {
  transition: all 0.75s;
}
.fade-enter-to {
  position: absolute;
  opacity: 1;
}
.fade-leave-from {
  position: absolute;
  opacity: 1;
}
</style>
