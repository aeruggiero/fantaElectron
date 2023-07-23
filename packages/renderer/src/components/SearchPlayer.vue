<script setup lang="ts">
import {onMounted, ref, inject} from 'vue';
import AutoComplete from 'primevue/autocomplete';
import {testmgr} from '#preload';
import {useForm, useField} from 'vee-validate';
import Button from 'primevue/button';
import Dropdown from 'primevue/dropdown';
import type {player, teamInfo} from '../../../preload/src/interfaces';
import type {Emitter, EventType} from 'mitt';
interface searchObject {
  originalEvent: InputEvent;
  query: string;
}
const emitter = inject('emitter') as Emitter<Record<EventType, unknown>>;
const {handleSubmit, resetForm} = useForm();
function validateField(val: number) {
  if (!val) {
    return 'È richiesto un nome.';
  }
  return true;
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const onSubmit = handleSubmit(async (values, actions) => {
  try {
    await testmgr.addPlayerToTeam(values.giocatore, values.squadra);
    resetForm();
    notifyTable();
  } catch (error) {
    console.log(error);
  }
});
const notifyTable = () => {
  emitter.emit('update-teams-table', 'ciaooo');
};

const giocatore = useField('giocatore', validateField);
const squadra = useField('squadra', validateField);
var teams: teamInfo[];
onMounted(async () => {
  teams = await testmgr.getTeamList();
});
const items = ref<player[]>([]);
const search = async (event: searchObject) => {
  if (event.query.length > 0) {
    items.value = (await testmgr.getPlayers(event.query)) as player[];
  } else {
    items.value = [];
  }
};
</script>
<template>
  <form @submit="onSubmit">
    <AutoComplete
      id="giocatore"
      v-model="giocatore.value.value"
      :suggestions="items"
      option-label="nome"
      @complete="search"
    />
    <Dropdown
      v-model="squadra.value.value"
      :options="teams"
      option-label="nome"
      placeholder="Seleziona una squadra"
    />
    <Button
      type="submit"
      label="Aggiungi giocatore a squadra"
    />
  </form>
</template>
