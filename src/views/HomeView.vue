<template>
  <h1>Bestandenlijst Popkoor SoSjaal</h1>
  <p>
    Hier vind je alle muziekbestanden en muziekbladbestanden van Popkoor
    SoSjaal.
  </p>
  <base-card v-if="authStore.user.id">
    <h2>Bestanden uploaden</h2>
    <form @submit.prevent="handleSubmit">
      <div class="mb-3">
        <label class="form-label" for="folderName"
          >Kies een bestaande foldernaam of maak een nieuwe</label
        >
        <input
          class="form-control"
          type="text"
          name="folderName"
          id="folderName"
          v-model="store.folderName"
          placeholder="Foldernaam"
        />
      </div>
      <div class="mb-3">
        <label class="form-label" for="upload"
          >Upload een bestand (mpeg/ mp3/ wav/ pdf)</label
        >
        <input
          type="file"
          name="upload"
          id="upload"
          class="form-control"
          ref="fileInput"
        />
      </div>
      <base-button mode="btn-primary">Upload</base-button>
    </form>
    <p class="text-danger" v-if="store.uploadError">
      {{ store.uploadErrorMessage }}
    </p>
  </base-card>

  <base-card>
    <h2>Bestandenlijst</h2>
    <div class="d-flex justify-content-center" v-if="store.isLoading">
      <base-spinner></base-spinner>
    </div>
    <div class="accordion accordion-flush" id="accordion" v-cloak v-else>
      <div
        class="accordion-item border rounded mb-3"
        v-for="(item, index) in store.fileList"
        :key="index"
      >
        <h2 class="accordion-header" :id="'item-heading-' + index">
          <button
            class="accordion-button collapsed accordion-button-secondary"
            type="button"
            data-bs-toggle="collapse"
            :data-bs-target="'#item-' + index"
            aria-expanded="false"
            :aria-controls="'item-' + index"
            @click="handleItemClick(item)"
          >
            {{ item.name }}
          </button>
        </h2>
        <div
          :id="'item-' + index"
          class="accordion-collapse collapse"
          :aria-labelledby="'item-heading-' + index"
        >
          <ul class="list-group p-3" v-if="item.isFolder">
            <li
              v-for="(file, fileIndex) in item.files"
              :key="fileIndex"
              class="list-group-item d-flex justify-content-between align-items-center"
            >
              {{ file.name }}
              <div class="d-flex">
                <base-button
                  v-if="authStore.user.id"
                  class="m-1"
                  mode="btn-danger"
                  @click="store.deleteFile(item.name, file)"
                  >Verwijderen</base-button
                >
                <base-button
                  class="m-1"
                  mode="btn-primary"
                  @click="store.download(item.name, file)"
                  >Downloaden</base-button
                >
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </base-card>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useAuthStore } from '../stores/auth';
import { useFileStore } from '../stores/file';

const fileInput = ref(null);
const store = useFileStore();
const authStore = useAuthStore();

const handleItemClick = (item) => {
  if (!item.isFolder) return;

  store.fetchFilesInFolder(item);
};

const handleSubmit = () => {
  const file = fileInput.value.files[0];

  if (file) {
    store.uploadFile(file);
  } else {
    store.uploadError = true;
    store.uploadErrorMessage = 'Geen bestand geselecteerd';
  }
};

onMounted(() => {
  store.fetchFileList();
});
</script>

<style scoped>
.accordion-button:not(.collapsed) {
  background-color: transparent;
}
</style>
