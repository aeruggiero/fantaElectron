<script
  setup
  lang="ts"
>
import type {FileUploadRemoveUploadedFile} from 'primevue/fileupload';
import FileUpload from 'primevue/fileupload';
import {useToast} from 'primevue/usetoast';
import {testmgr} from '#preload';
import Toast from 'primevue/toast';
import Button from 'primevue/button';
import {XLSX} from '#preload';
import type {player} from '../../../preload/src/interfaces';
const toast = useToast();
const onAdvancedUpload = async (event: FileUploadRemoveUploadedFile) => {
  if (event.files && event.files[0]) {
    try {
      const workbook = XLSX.readFile(event.files[0].path);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const data = XLSX.utils.sheet_to_json(worksheet);
      await testmgr.addPlayers(data as player[]);
      toast.add({severity: 'info', summary: 'Success', detail: 'File Uploaded', life: 3000});
    } catch (error) {
      console.log(error);
    }
  }
};
const downloadTemplate = () => {
  const aoaData = [['Nome', 'Squadra', 'Ruolo', 'Quotazione', 'Trequartista']];
  const workSheet = XLSX.utils.aoa_to_sheet(aoaData);
  const workBook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workBook, workSheet, 'Sheet 1');
  XLSX.writeFile(workBook, 'template.xlsx');
};
</script>
<template>
  <div>
    <h1>Carica giocatori</h1>
    <div>
      <p>Il file excel deve avere questa struttura!</p>
      <img
        src="../../assets/templatePlayerLoad.png"
        alt="Template Giocatori"
      />
      <Button
        label="Scarica Template"
        @click="
          {
            downloadTemplate();
          }
        "
      />
    </div>
    <div class="card flex justify-content-center">
      <form>
        <Toast />
        <FileUpload
          name="demo[]"
          accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          :multiple="true"
          custom-upload
          :max-file-size="1000000"
          @uploader="onAdvancedUpload($event)"
        >
          <template #empty>
            <p>Drag and drop files to here to upload.</p>
          </template>
        </FileUpload>
      </form>
    </div>
  </div>
</template>
