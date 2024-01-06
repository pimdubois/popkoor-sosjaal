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
  const concertName = ref(null);
  const songName = ref(null);

  function extractFolderName(fullPath) {
    const parts = fullPath.split('/');
    return parts[parts.length - 1];
  }

  function transformFolders(data) {
    return data.map((item) => {
      const newItem = {
        name: item.name,
        isFolder: item.isFolder,
        files: item.files,
        subFolder: item.subFolder
          ? item.subFolder.map((sub) => ({
              name: extractFolderName(sub.name),
              isFolder: sub.isFolder,
              files: sub.files,
              subFolder: sub.subFolder
                ? sub.subFolder.map((innerSub) => ({
                    name: extractFolderName(innerSub.name),
                    isFolder: innerSub.isFolder,
                    files: innerSub.files,
                  }))
                : [],
            }))
          : [],
      };
      return newItem;
    });
  }

  async function uploadFile(files, concertName, songName) {
    console.log('uploadFile ~ files:', files);
    const allowedAudioFiles = [
      'audio/mpeg',
      'audio/mp3',
      'audio/wav',
      'application/pdf',
      'folder',
    ];

    uploadError.value = false;
    isLoading.value = true;

    for (const file of files) {
      const fileExists = fileList.value.some((item) => item.name === file.name);

      if (fileExists) {
        uploadError.value = true;
        uploadErrorMessage.value = `Het bestand met de naam "${file.name}" bestaat al.`;
        return;
      }

      if (allowedAudioFiles.includes(file.type)) {
        const storageRef = firebaseStorageRef(
          storage,
          concertName.value
            ? `${concertName.value}/${songName.value}/${file.name}`
            : file.name
        );
        await uploadBytes(storageRef, file);
        fetchFileList();
        fileInput.value = null;
        isLoading.value = false;
      } else {
        uploadError.value = true;
        uploadErrorMessage.value =
          'Ongeldig bestandstype. Alleen specifieke bestandstypen zijn toegestaan!';
        isLoading.value = false;
      }
    }
  }

  async function fetchFileList() {
    isLoading.value = true;
    const listRef = firebaseStorageRef(storage, '');

    try {
      async function explorePrefixes(prefixes, currentPath = '') {
        if (!prefixes || prefixes.length === 0) return [];

        const folders = [];

        for (const prefixRef of prefixes) {
          const newPath = currentPath
            ? `${currentPath}/${prefixRef.name.split('/').pop()}`
            : prefixRef.name.split('/').pop();

          const folderItem = {
            name: newPath,
            isFolder: true,
            files: [],
            subFolder: [],
          };

          const res = await listAll(prefixRef);
          const subItems = res.items.map((itemRef) => ({
            name: itemRef.name,
            isFolder: false,
          }));

          folderItem.files = subItems;

          folderItem.subFolder = await explorePrefixes(res.prefixes, newPath);
          folders.push(folderItem);
        }

        return folders;
      }

      const listResult = await listAll(listRef);
      const items = listResult.items.map((itemRef) => ({
        name: itemRef.name,
        isFolder: true,
        files: [],
        subFolder: [],
      }));

      const mainFolders = await explorePrefixes(listResult.prefixes);

      const completeStructure = [...items, ...mainFolders];

      fileList.value = transformFolders(completeStructure);

      isLoading.value = false;
    } catch (error) {
      console.error('Fout bij ophalen van bestanden:', error);
      isLoading.value = false;
    }
  }

  async function download(concertPath, songPath, file) {
    const storageRef = firebaseStorageRef(
      storage,
      `${concertPath}/${songPath}/${file.name}`
    );
    const downloadURL = await getDownloadURL(storageRef);

    window.open(downloadURL, '_blank');
  }

  async function deleteFile(concertPath, songPath, file) {
    const filePath = concertPath
      ? `${concertPath}/${songPath}/${file.name}`
      : file.name;
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
    download,
    deleteFile,
    fileList,
    uploadError,
    uploadErrorMessage,
    isLoading,
    fileInput,
    concertName,
    songName,
  };
});
