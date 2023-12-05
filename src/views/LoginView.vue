<template>
  <base-card>
    <form @submit.prevent="submitForm">
      <div class="mb-3">
        <label for="email" class="form-label">Email</label>
        <input
          class="form-control"
          type="email"
          name="email"
          id="email"
          v-model.trim="email"
        />
      </div>
      <div class="mb-3">
        <label class="form-label" for="password">Password</label>
        <input
          class="form-control"
          type="password"
          name="password"
          id="password"
          v-model.trim="password"
        />
      </div>
      <p class="text-danger" v-if="!formIsValid">
        Please enter a valid email and password (must be at least 6 characters
        long)
      </p>
      <base-button mode="btn-primary">login</base-button>
    </form>
  </base-card>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const store = useAuthStore();
const email = ref(null);
const password = ref(null);
const router = useRouter();
const formIsValid = ref(true);
const error = ref(null);

const submitForm = async () => {
  formIsValid.value = true;

  if (
    email.value === '' ||
    !email.value?.includes('@') ||
    password.value.length < 6
  ) {
    formIsValid.value = false;
    return;
  }

  try {
    await store.login(email.value, password.value);
    router.replace('/');
  } catch (error) {
    error.value = error.message || 'Failed to authenticate, try later.';
  }
};

// const tryLogin = () => {
//   const token = localStorage.getItem('token');
//   const userId = localStorage.getItem('userId');

//   if (token && userId) {
//     console.log('Automatisch ingelogd met idToken en localId.');
//   }
// };
</script>
