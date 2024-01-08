import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyC9qQv81rNNQQBDk0c1MheKec3K8rrS1l8',
  authDomain: 'popkoor-sosjaal.firebaseapp.com',
  projectId: 'popkoor-sosjaal',
  storageBucket: 'popkoor-sosjaal.appspot.com',
  messagingSenderId: '1000526704798',
  appId: '1:1000526704798:web:15df8810260115086ecb8f',
};
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const auth = getAuth(app);

export { auth, storage };
