<script>
import 'yama-normalize'
</script>

<template>
  <div>
    <NuxtRouteAnnouncer />
    <NuxtLoadingIndicator />
    <main>
        <nuxt-link to="/">TOP</nuxt-link>
        <NuxtPage />
    </main>
    <footer class="footer">
        <p>Source : yamanoku/vuefesjapan-speaker</p>
    </footer>
  </div>
</template>

<style scoped>
.footer {
  padding: var(--y-rhythm-3);
  text-align: center;
}
</style>