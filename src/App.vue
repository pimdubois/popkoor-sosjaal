<template>
  <TheHeader />
  <main>
    <div class="container">
      <RouterView />
    </div>
  </main>
</template>

<script setup>
import { onMounted } from 'vue';
import TheHeader from './components/layout/TheHeader.vue';
import { useAuthStore } from './stores/auth';

const authStore = useAuthStore();

onMounted(() => {
  authStore.init();
});
</script>
