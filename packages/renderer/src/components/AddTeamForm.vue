<script setup lang="ts">
import {inject} from 'vue';
import {testmgr} from '#preload';
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
    testmgr.addName(values.value);
    resetForm();
    notifyTable();
  }
});
const notifyTable = () => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  emitter.emit('update-teams-table', 'ciaooo');
};
const {value} = useField('value', validateField);
</script>
<template>
  <form
    style="display: flex; flex-direction: column; gap: 0.5rem"
    class="text-red-800"
    @submit="onSubmit"
  >
    <div class="card flex justify-content-center">
      <span class="p-float-label">
        <InputText
          id="value"
          v-model="value"
          type="text"
        />
        <label for="value">Nome squadra</label>
      </span>
    </div>
    <Button
      type="submit"
      label="Aggiungi nuova squadra"
    />
  </form>
</template>
