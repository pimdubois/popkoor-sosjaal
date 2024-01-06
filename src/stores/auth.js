import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

export const useAuthStore = defineStore('auth', () => {
  const user = ref({});
  const isLoggedIn = ref(false);
  const isAdmin = ref(false);
  const router = useRouter();

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
      isLoggedIn.value = true;
      console.log('login ~ isLoggedIn:', isLoggedIn);
    } catch (error) {
      console.error('Fout bij inloggen:', error.message);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      isLoggedIn.value = false;
      router.push('/login');
      console.log('User signed out');
    } catch (error) {
      console.error('Fout bij uitloggen:', error.message);
    }
  };

  const init = async () => {
    try {
      onAuthStateChanged(auth, async (userCredentials) => {
        if (userCredentials) {
          const idTokenResult = await userCredentials.getIdTokenResult();

          user.value.id = userCredentials.uid;
          user.value.email = userCredentials.email;
          isLoggedIn.value = true;
          console.log('onAuthStateChanged ~ isLoggedIn:', isLoggedIn);

          if (idTokenResult.claims.rol === 'admin') {
            isAdmin.value = true;
          } else {
            isAdmin.value = false;
          }
        } else {
          user.value = {};
          isAdmin.value = false;
          isLoggedIn.value = false;
          console.log('onAuthStateChanged ~ isLoggedIn:', isLoggedIn);
        }
      });
    } catch (error) {
      console.error(
        'Er is een fout opgetreden tijdens het inloggen met opgeslagen credentials:',
        error.message
      );
    }
  };

  return { login, logout, init, user, isAdmin, isLoggedIn };
});
