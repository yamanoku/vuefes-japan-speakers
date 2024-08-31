<script>
import "yama-normalize";
</script>

<template>
  <div>
    <NuxtRouteAnnouncer />
    <NuxtLoadingIndicator />
    <main>
      <NuxtPage />
    </main>
    <footer class="footer">
      <p>Source : <a href="https://github.com/yamanoku/vuefes-japan-speakers">yamanoku/vuefes-japan-speakers</a></p>
    </footer>
  </div>
</template>

<style scoped>
.footer {
  padding: var(--y-rhythm-3);
  text-align: center;
}
</style>
