<script lang="ts" setup>
import {testmgr} from '#preload';
import Swal from 'sweetalert2';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import {onMounted, ref} from 'vue';
import {useRoute, useRouter} from 'vue-router';
import Button from 'primevue/button';
const route = useRoute();
const router = useRouter();
const team = ref();
const tableUpdate = ref(0);
const tableUpdate2 = ref(0);
const teamPlayers = ref();
onMounted(async () => {
  team.value = await testmgr.getTeamList(Number(route.params.id));
  teamPlayers.value = await testmgr.getPlayers(null, Number(route.params.id));
});
const removePlayer = async (
  playerId: number,
  playerValue: number,
  quotazione: number,
  nome: string,
) => {
  Swal.fire({
    title: `Rimuovi ${nome}`,
    html: `Stai per rimuovere ${nome} dalla squadra. Quanto vuoi fare recuperare alla squadra?
    <div class='m-3 bg-yellow-300 w-fit rounded'>Prezzo d'acquisto: ${playerValue} <input type='radio' name='quantity'value="${playerValue}"/></div>
    <div class='m-3 bg-yellow-300 w-fit rounded'>Quotazione: ${
      quotazione ?? 'N.A.'
    } <input type='radio' name='quantity' value="${quotazione}"/></div>
    `,
    icon: 'question',
    preConfirm: () => {
      const quantity = (<HTMLInputElement>(
        Swal.getPopup()?.querySelector('input[name="quantity"]:checked')
      ))?.value;
      if (!quantity) {
        Swal.fire('Errore', "C'è stato un errore.", 'error');
        return;
      }
      return quantity;
    },
  }).then(async quantity => {
    if (!quantity || !quantity.value || !(Number(quantity.value) > 0)) {
      Swal.fire('Errore', "C'è stato un errore.", 'error');
      return;
    }
    const update = await testmgr.removePlayer(
      Number(route.params.id),
      playerId,
      Number(quantity.value),
    );
    if (update) {
      team.value = await testmgr.getTeamList(Number(route.params.id));
      teamPlayers.value = await testmgr.getPlayers(null, Number(route.params.id));
      tableUpdate.value++;
      tableUpdate2.value++;
    }
  });
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
          :key="tableUpdate2"
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
          field="ruolo"
          header="Ruolo"
          sortable
        ></Column>
        <Column
          field="quotazione"
          header="Quotazione"
          sortable
        ></Column>
        <Column
          field="prezzo_acquisto"
          header="Prezzo d'acquisto"
          sortable
        ></Column>
        <Column header="Elimina">
          <template #body="{data}">
            <Button
              icon="icon-trash"
              severity="danger"
              raised
              rounded
              @click="removePlayer(data.id, data.prezzo_acquisto, data.quotazione, data.nome)"
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
