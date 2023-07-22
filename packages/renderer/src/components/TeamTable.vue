<script lang="ts" setup>
import {testmgr} from '#preload';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import {onMounted, ref, inject} from 'vue';
import RouterLinkButton from './RouterLinkButton.vue';
import type {Emitter, EventType} from 'mitt';
const emitter = inject('emitter') as Emitter<Record<EventType, unknown>>; // Inject `emitter`

emitter.on('update-teams-table', async () => {
  teams.value = await testmgr.getTeamList();
});

const teams = ref();
onMounted(async () => {
  teams.value = await testmgr.getTeamList();
});
</script>

<template>
  <template v-if="teams">
    <DataTable :value="teams">
      <Column
        header="Nome"
        sortable
      >
        <template #body="{data}">
          <RouterLinkButton
            :to="{name: 'TeamPage', params: {id: data.id}}"
            :label="data.nome"
            class="w-fit"
          />
        </template>
      </Column>
      <Column
        field="finanze"
        header="Finanze"
        sortable
      ></Column>
      <Column
        field="tot_giocatori"
        header="Rosa"
        sortable
      ></Column>
      <Column
        field="tot_A"
        header="Attaccanti"
        sortable
      ></Column>
      <Column
        field="tot_C"
        header="Centrocampisti"
        sortable
      ></Column>
      <Column
        field="tot_D"
        header="Difensori"
        sortable
      ></Column>
      <Column
        field="tot_P"
        header="Portieri"
        sortable
      ></Column>
    </DataTable>
  </template>
  <template v-else>
    <p>Loading...</p>
  </template>
</template>
