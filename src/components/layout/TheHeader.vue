<template>
  <header>
    <nav class="navbar navbar-expand-lg navbar-light bg-light mb-3">
      <div class="container">
        <base-button class="navbar-brand" to="/" link
          >Popkoor SoSjaal</base-button
        >
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
          aria-controls="navbarContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarContent">
          <div class="me-auto mb-2 mb-lg-0"><!-- TIJDELIJK DIVJE --></div>
          <!-- <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item">
              <a class="nav-link active" aria-current="page" href="#">Muziek</a>
            </li>
          </ul> -->
          <base-button
            link
            mode="btn-primary"
            to="/login"
            v-if="!authStore.isLoggedIn"
            >Login</base-button
          >
          <base-button link mode="btn-primary" @click="authStore.logout" v-else
            >Logout</base-button
          >
        </div>
      </div>
    </nav>
  </header>
</template>

<script setup>
import { useAuthStore } from '../../stores/auth';

const authStore = useAuthStore();
</script>
