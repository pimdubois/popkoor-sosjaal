import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';

import { createPinia } from 'pinia';
import { createApp } from 'vue';

import BaseButton from './components/ui/BaseButton.vue';
import BaseCard from './components/ui/BaseCard.vue';
import BaseSpinner from './components/ui/BaseSpinner.vue';

import App from './App.vue';
import router from './router';

const app = createApp(App);

app.use(createPinia());
app.use(router);

app.component('base-button', BaseButton);
app.component('base-card', BaseCard);
app.component('base-spinner', BaseSpinner);

app.mount('#app');
