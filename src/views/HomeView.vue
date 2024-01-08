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

  <base-card v-if="authStore.isLoggedIn">
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
                              class="m-1"
                              mode="btn-danger btn-sm"
                              @click="
                                store.deleteFile(item.name, subItem.name, file)
                              "
                            >
                              Verwijderen
                            </base-button>
                            <base-button
                              class="m-1"
                              mode="btn-primary btn-sm"
                              @click="
                                store.download(item.name, subItem.name, file)
                              "
                            >
                              Downloaden
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
  </base-card>
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
