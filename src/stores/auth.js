import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useAuthStore = defineStore('auth', () => {
  const user = ref({});

  const auth = getAuth();

  const login = async (email, password) => {
    try {
      const userCredentials = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const authenticatedUser = userCredentials.user;

      user.value.id = authenticatedUser.uid;
      user.value.email = authenticatedUser.email;
    } catch (error) {
      console.error('Fout bij inloggen:', error.message);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      console.log('User signed out');
    } catch (error) {
      console.error('Fout bij uitloggen:', error.message);
    }
  };

  const init = async () => {
    try {
      onAuthStateChanged(auth, (userCredentials) => {
        if (userCredentials) {
          user.value.id = userCredentials.uid;
          user.value.email = userCredentials.email;
        } else {
          user.value = {};
        }
      });
    } catch (error) {
      console.error('Fout bij inloggen met opgeslagen credentials.');
    }
  };

  return { login, logout, init, user };
});
