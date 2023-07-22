<script setup lang="ts">
import type {FileUploadRemoveUploadedFile} from 'primevue/fileupload';
import FileUpload from 'primevue/fileupload';
import {useToast} from 'primevue/usetoast';
import {XLSX, testmgr} from '#preload';
import Toast from 'primevue/toast';
const toast = useToast();

const onAdvancedUpload = async (event: FileUploadRemoveUploadedFile) => {
  if (event.files && event.files[0]) {
    console.log(typeof event, event);
    const workbook = XLSX.readFile(event.files[0].path);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(worksheet);

    await testmgr.addPlayers(data);
    toast.add({severity: 'info', summary: 'Success', detail: 'File Uploaded', life: 3000});
  }
};
</script>
<template>
  <h1>Carica giocatori</h1>
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
</template>
