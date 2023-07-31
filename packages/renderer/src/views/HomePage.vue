<script
  lang="ts"
  setup
>
import TeamTable from '../components/TeamTable.vue';
import AddTeamForm from '../components/AddTeamForm.vue';
import SearchPlayer from '../components/SearchPlayer.vue';
</script>

<template>
  <div>
    <search-player />
    <add-team-form />
    <team-table />
  </div>
</template>
