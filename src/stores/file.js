import { storage } from '@/firebase';
import {
  deleteObject,
  ref as firebaseStorageRef,
  getDownloadURL,
  listAll,
  uploadBytes,
} from 'firebase/storage';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useFileStore = defineStore('file', () => {
  const fileList = ref([]);
  const uploadError = ref(false);
  const uploadErrorMessage = ref('');
  const isLoading = ref(false);
  const fileInput = ref(null);
  const folderName = ref(null);

  async function uploadFile(file) {
    const allowedAudioFiles = [
      'audio/mpeg',
      'audio/mp3',
      'audio/wav',
      'application/pdf',
      'folder',
    ];

    uploadError.value = false;
    isLoading.value = true;

    const fileExists = fileList.value.some((item) => item.name === file.name);

    if (fileExists) {
      uploadError.value = true;
      uploadErrorMessage.value = `Het geluidsbestand met de naam "${file.name}" bestaat al.`;
      return;
    }

    if (allowedAudioFiles.includes(file.type)) {
      const storageRef = firebaseStorageRef(
        storage,
        folderName.value ? `${folderName.value}/${file.name}` : file.name
      );
      await uploadBytes(storageRef, file);
      fetchFileList();
      fileInput.value = null;
      isLoading.value = false;
    } else {
      uploadError.value = true;
      uploadErrorMessage.value =
        'Ongeldig bestandstype. Alleen geluidsbestanden zijn toegestaan!';
      isLoading.value = false;
    }
  }

  async function fetchFileList() {
    isLoading.value = true;
    const listRef = firebaseStorageRef(storage, '');
    const listResult = await listAll(listRef);

    try {
      const items = listResult.items.map((item) => {
        return {
          name: item.name,
          isFolder: false,
          folderName: folderName.value,
        };
      });
      const folders = listResult.prefixes.map((prefix) => {
        return {
          name: prefix.name,
          isFolder: true,
          files: [],
        };
      });

      fileList.value = [...items, ...folders];
      isLoading.value = false;
    } catch (error) {
      console.error('Fout bij ophalen van bestanden:', error);
      isLoading.value = false;
    }
  }

  async function fetchFilesInFolder(folder) {
    const folderRef = firebaseStorageRef(storage, folder.name);
    const folderListResult = await listAll(folderRef);

    try {
      folder.files = folderListResult.items.map((file) => {
        return {
          name: file.name,
          isFolder: false,
        };
      });

      fileList.value = [...fileList.value];
    } catch (error) {
      console.error('Fout bij ophalen van bestanden:', error);
    }
  }

  async function download(path, file) {
    const storageRef = firebaseStorageRef(storage, `${path}/${file.name}`);
    const downloadURL = await getDownloadURL(storageRef);

    window.open(downloadURL, '_blank');
  }

  async function deleteFile(path, file) {
    const filePath = path ? `${path}/${file.name}` : file.name;
    const storageRef = firebaseStorageRef(storage, filePath);

    try {
      await deleteObject(storageRef);
      fetchFileList();
    } catch (error) {
      console.error('Fout bij het verwijderen van bestand:', error);
    }
  }

  return {
    uploadFile,
    fetchFileList,
    fetchFilesInFolder,
    download,
    deleteFile,
    fileList,
    uploadError,
    uploadErrorMessage,
    isLoading,
    fileInput,
    folderName,
  };
});
