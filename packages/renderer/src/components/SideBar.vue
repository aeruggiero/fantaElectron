<script
  setup
  lang="ts"
>
import RouterLinkButton from './RouterLinkButton.vue';
</script>

<template>
  <aside class="w-full sm:w-1/3 md:w-1/4 px-2 bg-slate-400">
    <div class="sticky top-0 p-4 rounded-xl w-full">
      <ul class="nav flex flex-col overflow-hidden gap-3">
        <li>
          <RouterLinkButton
            to="/"
            icon="icon-coin-dollar"
            label="Squadre"
          />
        </li>
        <li>
          <RouterLinkButton
            to="/rules"
            icon="icon-edit"
            label="Regole"
          />
        </li>
        <li>
          <RouterLinkButton
            to="/loadPlayers"
            icon="icon-coaches"
            label="Giocatori"
          />
        </li>
      </ul>
    </div>
  </aside>
</template>
