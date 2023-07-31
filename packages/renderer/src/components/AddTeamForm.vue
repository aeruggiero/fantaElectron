<script setup lang="ts">
import {inject} from 'vue';
import {openDialog, testmgr} from '#preload';
import {useForm, useField} from 'vee-validate';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
const emitter = inject('emitter');
const {handleSubmit, resetForm} = useForm();
function validateField(val: string | null) {
  if (!val) {
    return 'È richiesto un nome.';
  }
  return true;
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const onSubmit = handleSubmit(async (values, actions) => {
  if (values.value && values.value.length > 0) {
    try {
      await testmgr.addName(values.value);
      resetForm();
      notifyTable();
    } catch (error) {
      openDialog('showMessageBox', {
        title: 'ERRORE',
        type: 'error',
        message: error,
      });
    }
  }
});
const notifyTable = () => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  emitter.emit('update-teams-table', 'ciaooo');
};
const {value, errors, errorMessage} = useField('value', validateField);
</script>
<template>
  <form
    class="text-red-800 flex p-2 border-2 gap-2 justify-center align-middle rounded-xl m-2 shadow-md shadow-emerald-200"
    @submit="onSubmit"
  >
    <div class="card flex justify-content-center flex-col">
      <span class="p-float-label">
        <InputText
          id="value"
          v-model="value"
          type="text"
        />
        <label for="value">Nome squadra</label>
      </span>
      <small
        id="number-error"
        class="p-error"
      >
        {{ errorMessage || (errors.length > 0 ? errors : '&nbsp;') }}
      </small>
    </div>
    <Button
      type="submit"
      label="Aggiungi nuova squadra"
    />
  </form>
</template>
