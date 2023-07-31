<script lang="ts" setup>
import InputNumber from 'primevue/inputnumber';
import Button from 'primevue/button';
import {useForm, useField} from 'vee-validate';
import {onMounted} from 'vue';
import type {regole} from '../../../preload/src/interfaces';
import {testmgr, openDialog} from '#preload';
const {handleSubmit} = useForm();
const finanze_iniziali = useField('finanze_iniziali', validateField);
const max_rosa = useField('max_rosa', validateField);
const max_atk = useField('max_atk', validateField);
const max_dc = useField('max_dc', validateField);
const max_cc = useField('max_cc', validateField);
const max_por = useField('max_por', validateField);
var rules: regole;

onMounted(async () => {
  rules = <regole>await testmgr.getRegole();
  finanze_iniziali.setValue(rules.finanze_iniziali);
  max_rosa.setValue(rules.max_rosa);
  max_atk.setValue(rules.max_atk);
  max_cc.setValue(rules.max_cc);
  max_dc.setValue(rules.max_dc);
  max_por.setValue(rules.max_por);
});

function validateField(value: number) {
  if (!value) {
    return 'Year is required.';
  }

  return true;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const onSubmit = handleSubmit(async (values, actions) => {
  values.id = rules.id;
  try {
    await testmgr.updateRegole(values as regole);
    openDialog('showMessageBox', {
      title: 'Regole salvate',
      type: 'info',
      message: 'Le regole sono state salvate con successo!',
    });
  } catch (errore) {
    openDialog('showMessageBox', {
      title: 'ERRORE',
      type: 'error',
      message: "C'è stato un errore durante il salvataggio delle regole.",
    });
    console.log(errore);
  }
});
</script>
<template>
  <form
    id="fantaRules"
    style="display: flex; flex-direction: column; gap: 2rem; width: 10rem"
    @submit="onSubmit"
  >
    Regole squadre:
    <span class="p-float-label">
      <InputNumber
        id="finanze_iniziali"
        v-model="finanze_iniziali.value.value"
        show-buttons
        :min="0"
      />
      <label for="finanze_iniziali">Finanze iniziali</label>
    </span>
    <span class="p-float-label">
      <InputNumber
        id="max_rosa"
        v-model="max_rosa.value.value"
        show-buttons
        :min="0"
      />
      <label for="max_rosa">Massimo rosa</label>
    </span>
    <span class="p-float-label">
      <InputNumber
        id="max_atk"
        v-model="max_atk.value.value"
        show-buttons
        :min="0"
      />
      <label for="max_atk">Massimo attaccanti</label>
    </span>
    <span class="p-float-label">
      <InputNumber
        id="max_cc"
        v-model="max_cc.value.value"
        show-buttons
        :min="0"
      />
      <label for="max_cc">Massimo centrocampisti</label>
    </span>
    <span class="p-float-label">
      <InputNumber
        id="max_dc"
        v-model="max_dc.value.value"
        show-buttons
        :min="0"
      />
      <label for="max_dc">Massimo difensori</label>
    </span>
    <span class="p-float-label">
      <InputNumber
        id="max_por"
        v-model="max_por.value.value"
        show-buttons
        :min="0"
      />
      <label for="max_por">Massimo Portieri</label>
    </span>
    <Button
      type="submit"
      label="Salva regole"
    />
  </form>
</template>
