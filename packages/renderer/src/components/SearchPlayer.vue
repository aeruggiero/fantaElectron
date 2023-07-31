<script
  setup
  lang="ts"
>
import {onMounted, ref, inject} from 'vue';
import AutoComplete from 'primevue/autocomplete';
import {openDialog, testmgr} from '#preload';
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
function validatePlayer(player: player) {
  if (!player) {
    return 'È richiesto un nome.';
  }
  if (!player.id) {
    return 'Questo giocatore non esiste';
  }
  return true;
}
function validateTeam(team: teamInfo) {
  if (!team || !team.nome) {
    return 'È richiesto scegliere una squadra.';
  }

  return true;
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const onSubmit = handleSubmit(async (values, actions) => {
  try {
    await testmgr.addPlayerToTeam(values.giocatore, values.squadra);
    resetForm();
    notifyTable();
    openDialog('showMessageBox', {
      title: 'Successo!',
      type: 'info',
      message: `Giocatore ${values.giocatore.nome} aggiunto correttamente alla squadra ${values.squadra.nome}`,
    });
  } catch (error) {
    openDialog('showMessageBox', {
      title: 'ERRORE',
      type: 'error',
      message: error,
    });
  }
});
const notifyTable = () => {
  emitter.emit('update-teams-table', 'ciaooo');
};

const {
  value: giocatore,
  errors: gError,
  errorMessage: gErrMex,
} = useField('giocatore', validatePlayer);
const squadra = useField('squadra', validateTeam);
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
  <form
    class="text-red-800 flex flex-wrap p-2 border-2 gap-2 justify-center align-middle rounded-xl m-2 shadow-md shadow-emerald-200"
    @submit="onSubmit"
  >
    <div class="inline-flex flex-col w-fit">
      <AutoComplete
        id="giocatore"
        v-model="giocatore"
        :suggestions="items"
        option-label="nome"
        placeholder="Cerca giocatore"
        @complete="search"
      >
        <template #option="slotProps">
          <div>
            <p>
              {{ slotProps.option.nome }} -
              <span class="italic font-medium">{{ slotProps.option.ruolo }}</span> -
              {{ slotProps.option.quotazione }}
            </p>
          </div>
        </template>
      </AutoComplete>
      <small
        id="number-error"
        class="p-error"
      >
        {{ gErrMex || (gError.length > 0 ? gError : '&nbsp;') }}
      </small>
    </div>
    <div class="inline-flex flex-col w-fit">
      <Dropdown
        v-model="squadra.value.value"
        :options="teams"
        option-label="nome"
        placeholder="Seleziona una squadra"
        :input-class="{'p-invalid': squadra.errorMessage}"
      />
      <small
        id="number-error"
        class="p-error"
      >
        {{
          squadra.errorMessage.value ||
            (squadra.errors.value.length > 0 ? squadra.errors.value : '&nbsp;')
        }}
      </small>
    </div>
    <div class="w-full">
      <Button
        type="submit"
        label="Aggiungi giocatore a squadra"
      />
    </div>
  </form>
</template>
