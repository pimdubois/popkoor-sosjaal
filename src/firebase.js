import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyBMoY1nLjA3nEilfPreGzDjrqlxpXEYafE',
  authDomain: 'vue-http-demo-db432.firebaseapp.com',
  databaseURL:
    'https://vue-http-demo-db432-default-rtdb.europe-west1.firebasedatabase.app',
  projectId: 'vue-http-demo-db432',
  storageBucket: 'vue-http-demo-db432.appspot.com',
  messagingSenderId: '208237481791',
  appId: '1:208237481791:web:8281757e3298c640d84d8a',
};
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const auth = getAuth(app);

export { auth, storage };
