<script
  lang="ts"
  setup
>
import {testmgr} from '#preload';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import {onMounted, ref} from 'vue';
import {useRoute, useRouter} from 'vue-router';
import Button from 'primevue/button';
const route = useRoute();
const router = useRouter();
const team = ref();
const tableUpdate = ref(0);
const teamPlayers = ref();
onMounted(async () => {
  team.value = (await testmgr.getTeamList(Number(route.params.id)))[0];
  teamPlayers.value = await testmgr.getPlayers(null, Number(route.params.id));
});
const removePlayer = async (playerId: number, playerValue: number) => {
  const update = await testmgr.removePlayer(Number(route.params.id), playerId, playerValue);
  if (update) {
    team.value = (await testmgr.getTeamList(Number(route.params.id)))[0];
    teamPlayers.value = await testmgr.getPlayers(null, Number(route.params.id));
    tableUpdate.value++;
  }
};
const deleteTeam = async () => {
  try {
    await testmgr.deleteTeam(JSON.parse(JSON.stringify(team.value)));
    team.value = null;

    router.push('/');
  } catch (error) {
    console.log(error);
  }
};
</script>

<template>
  <div>
    <template v-if="team">
      <h1>{{ team.nome }}</h1>
      <Button
        label="Elimina squadra"
        severity="danger"
        @click="deleteTeam"
      />
      <div class="border rounded-lg overflow-hidden dark:border-gray-700 my-4">
        <table
          :key="tableUpdate"
          class="min-w-full divide-y divide-gray-200 dark:divide-gray-700"
        >
          <tr>
            <th>Finanze</th>
            <td>{{ team.finanze }}</td>
            <th>Totale Rosa</th>
            <td>{{ team.tot_giocatori ?? 0 }}</td>
          </tr>
          <tr>
            <th>Totale Attaccanti</th>
            <td>{{ team.tot_A ?? 0 }}</td>
            <th>Totale Centrocampisti</th>
            <td>{{ team.tot_C ?? 0 }}</td>
          </tr>
          <tr>
            <th>Totale Difensori</th>
            <td>{{ team.tot_D ?? 0 }}</td>
            <th>Totale portieri</th>
            <td>{{ team.tot_P ?? 0 }}</td>
          </tr>
        </table>
      </div>
    </template>
    <template v-else> Loading... </template>
    <template v-if="teamPlayers">
      <DataTable
        :key="tableUpdate"
        :value="teamPlayers"
      >
        <Column
          header="Nome"
          sortable
          field="nome"
          frozen
        >
        </Column>
        <Column
          field="quotazione"
          header="Quotazione"
          sortable
        ></Column>
        <Column
          field="ruolo"
          header="Ruolo"
          sortable
        ></Column>
        <Column header="Elimina">
          <template #body="{data}">
            <Button
              icon="icon-trash"
              severity="danger"
              raised
              rounded
              @click="removePlayer(data.id, data.quotazione)"
            />
          </template>
        </Column>
      </DataTable>
    </template>
    <template v-else>
      <p>Loading...</p>
    </template>
  </div>
</template>

<style scoped>
th {
  text-align: left;
  padding: 0.5rem;
  background-color: rgba(70, 131, 180, 0.443);
}
</style>
