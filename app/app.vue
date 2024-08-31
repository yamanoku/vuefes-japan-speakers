<script setup lang="ts">
import 'yama-normalize';

useHead({
  htmlAttrs: {
    lang: 'ja',
  },
  link: [
    {
      rel: 'icon',
      href: '/favicon.ico',
    },
  ],
  titleTemplate: (titleChunk) => {
    return titleChunk
      ? `${titleChunk} - Vue Fes Japan Speakers`
      : 'Vue Fes Japan Speakers';
  },
  meta: [
    {
      name: 'description',
      content: 'Vue Fes Japan歴代スピーカーまとめページ',
    },
    {
      name: 'og:image',
      content: '/og-image.png',
    },
  ],
});
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
