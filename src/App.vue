<script>
import Navbar from './components/Navbar.vue';

export default {
  components: {
    Navbar
  }
}
</script>

<template>
  <template v-if="$route.path !== '/login'">
    <Navbar />
  </template>
  <main class="container mx-auto pt-8 px-4 sm:px-0">
    <router-view />
  </main>
</template>
