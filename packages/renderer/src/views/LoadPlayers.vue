<script
  setup
  lang="ts"
>
import type {FileUploadRemoveUploadedFile} from 'primevue/fileupload';
import FileUpload from 'primevue/fileupload';
import {downloadTemplate, uploadPlayers} from '#preload';
import Toast from 'primevue/toast';
import Button from 'primevue/button';
import {writeFile} from 'xlsx';
const onAdvancedUpload = async (event: FileUploadRemoveUploadedFile) => {
  if (event.files && event.files[0]) {
    uploadPlayers(event.files[0]);
  }
};
const getTemplate = () => {
  const workbook = downloadTemplate();
  writeFile(workbook, 'template.xlsx');
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
        @click="getTemplate"
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
