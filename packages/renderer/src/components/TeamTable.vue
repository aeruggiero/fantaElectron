<script lang="ts" setup>
import {testmgr} from '#preload';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import {onMounted, ref, inject} from 'vue';
import RouterLinkButton from './RouterLinkButton.vue';
import type {Emitter, EventType} from 'mitt';
const emitter = inject('emitter') as Emitter<Record<EventType, unknown>>; // Inject `emitter`
const teams = ref();
emitter.on('update-teams-table', async () => {
  teams.value = await testmgr.getTeamList();
});

onMounted(async () => {
  teams.value = await testmgr.getTeamList();
});
</script>

<template>
  <template v-if="teams">
    <div class="card">
      <DataTable
        :value="teams"
        paginator
        scrollable
        scroll-height="500px"
        :rows="5"
        class="p-datatable-sm"
      >
        <Column
          field="nome"
          header="Nome"
          sortable
          frozen
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
          header="Atk"
          sortable
        ></Column>
        <Column
          field="tot_C"
          header="Cen"
          sortable
        ></Column>
        <Column
          field="tot_D"
          header="Dif"
          sortable
        ></Column>
        <Column
          field="tot_P"
          header="Por"
          sortable
        ></Column>
      </DataTable>
    </div>
  </template>
  <template v-else>
    <p>Loading...</p>
  </template>
</template>
