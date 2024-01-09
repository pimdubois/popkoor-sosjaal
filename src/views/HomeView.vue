<template>
  <h1>Bestandenlijst Popkoor SoSjaal</h1>
  <p>
    Hier vind je alle muziekbestanden en muziekbladbestanden van Popkoor
    SoSjaal.
  </p>

  <base-card v-if="authStore.isLoggedIn && authStore.isAdmin">
    <h2>Bestanden uploaden</h2>
    <form @submit.prevent="handleSubmit">
      <div class="mb-3">
        <label class="form-label" for="concertName"
          >Kies een bestaande foldernaam of maak een nieuwe</label
        >
        <input
          class="form-control"
          type="text"
          name="concertName"
          id="concertName"
          v-model="concertName"
          placeholder="Concertnaam"
        />
      </div>
      <div class="mb-3">
        <label for="songName" class="form-label">
          Kies een bestaand nummer of maak een nieuwe
        </label>
        <input
          type="text"
          class="form-control"
          name="songName"
          id="songName"
          v-model="songName"
          placeholder="Liednaam"
        />
      </div>
      <div class="mb-3">
        <label class="form-label" for="upload"
          >Upload één of meerdere bestanden (mpeg/ mp3/ wav/ pdf)</label
        >
        <input
          type="file"
          name="upload"
          id="upload"
          class="form-control"
          ref="fileInput"
          multiple
        />
      </div>
      <base-button mode="btn-primary">Uploaden</base-button>
    </form>
    <p class="text-danger" v-if="store.uploadError">
      {{ store.uploadErrorMessage }}
    </p>
  </base-card>

  <div v-if="authStore.isLoggedIn">
    <h2>Bestandenlijst</h2>
    <div class="d-flex justify-content-center" v-if="store.isLoading">
      <base-spinner></base-spinner>
    </div>

    <div class="accordion accordion-flush" id="accordion">
      <div
        v-for="(item, index) in store.fileList"
        class="accordion-item border rounded mb-3"
      >
        <div v-if="item.isFolder">
          <h2 class="accordion-header" :id="'item-heading-' + index">
            <button
              class="accordion-button collapsed accordion-button-secondary"
              type="button"
              data-bs-toggle="collapse"
              :data-bs-target="'#item-' + index"
              aria-expanded="false"
              :aria-controls="'item-' + index"
            >
              {{ item.name }}
            </button>
          </h2>
          <div
            :id="'item-' + index"
            class="accordion-collapse collapse"
            :aria-labelledby="'item-heading-' + index"
          >
            <ul
              v-if="item.subFolder && item.subFolder.length"
              class="list-group p-3"
            >
              <li
                v-for="(subItem, index) in item.subFolder"
                :key="index"
                class="list-group-item p-0 border-0"
              >
                <div class="accordion accordion-flush">
                  <div class="accordion-item border rounded mb-3">
                    <h2
                      class="accordion-header"
                      :id="'subItem-heading-' + index"
                    >
                      <button
                        class="accordion-button collapsed accordion-button-secondary"
                        type="button"
                        data-bs-toggle="collapse"
                        :data-bs-target="'#subItem-' + index"
                        aria-expanded="false"
                        :aria-controls="'subItem-' + index"
                      >
                        {{ subItem.name }}
                      </button>
                    </h2>
                    <div
                      :id="'subItem-' + index"
                      class="accordion-collapse collapse"
                      :aria-labelledby="'subItem-heading-' + index"
                    >
                      <ul
                        class="list-group p-3"
                        v-if="subItem.files && subItem.files.length"
                      >
                        <li
                          v-for="(file, fileIndex) in subItem.files"
                          :key="fileIndex"
                          class="list-group-item d-flex align-items-center"
                        >
                          <div class="flex-grow-1 text-truncate">
                            {{ file.name }}
                          </div>
                          <div class="d-flex">
                            <base-button
                              v-if="authStore.isAdmin"
                              class="m-1 d-none d-sm-block"
                              mode="btn-danger btn-sm"
                              @click="
                                store.deleteFile(item.name, subItem.name, file)
                              "
                            >
                              Verwijderen
                            </base-button>
                            <base-button
                              class="m-1 d-none d-sm-block"
                              mode="btn-primary btn-sm"
                              @click="
                                store.download(item.name, subItem.name, file)
                              "
                            >
                              Downloaden
                            </base-button>
                            <base-button
                              v-if="authStore.isAdmin"
                              class="m-1 d-block d-sm-none btn-sm"
                              @click="
                                store.deleteFile(item.name, subItem.name, file)
                              "
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                height="16"
                                width="14"
                                viewBox="0 0 448 512"
                              >
                                <!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.-->
                                <path
                                  d="M135.2 17.7C140.6 6.8 151.7 0 163.8 0H284.2c12.1 0 23.2 6.8 28.6 17.7L320 32h96c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 96 0 81.7 0 64S14.3 32 32 32h96l7.2-14.3zM32 128H416V448c0 35.3-28.7 64-64 64H96c-35.3 0-64-28.7-64-64V128zm96 64c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16z"
                                /></svg
                            ></base-button>
                            <base-button
                              class="m-1 d-block d-sm-none btn-sm"
                              @click="
                                store.download(item.name, subItem.name, file)
                              "
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                height="16"
                                width="12"
                                viewBox="0 0 384 512"
                              >
                                <!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.-->
                                <path
                                  d="M64 0C28.7 0 0 28.7 0 64V448c0 35.3 28.7 64 64 64H320c35.3 0 64-28.7 64-64V160H256c-17.7 0-32-14.3-32-32V0H64zM256 0V128H384L256 0zM216 232V334.1l31-31c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-72 72c-9.4 9.4-24.6 9.4-33.9 0l-72-72c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l31 31V232c0-13.3 10.7-24 24-24s24 10.7 24 24z"
                                />
                              </svg>
                            </base-button>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { onMounted, ref } from 'vue';
import { useAuthStore } from '../stores/auth';
import { useFileStore } from '../stores/file';

const fileInput = ref(null);
const store = useFileStore();
const authStore = useAuthStore();
const concertName = ref(null);
const songName = ref(null);

const handleSubmit = () => {
  const files = fileInput.value.files;

  if (files) {
    store.uploadFile(files, concertName, songName);
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
