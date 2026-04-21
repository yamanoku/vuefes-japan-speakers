<script setup lang="ts">
useHead({
  htmlAttrs: {
    lang: 'ja',
  },
  link: [
    { rel: 'icon', href: '/favicon.ico' },
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600&family=IBM+Plex+Sans+JP:wght@300;400;500&family=JetBrains+Mono:wght@400;500&display=swap',
    },
  ],
  titleTemplate: (title) => {
    return title ? `${title} - Vue Fes Japan Speakers` : 'Vue Fes Japan Speakers';
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

useSeoMeta({
  twitterCard: 'summary_large_image',
});
</script>

<template>
  <UApp>
    <NuxtRouteAnnouncer />
    <NuxtLoadingIndicator />
    <NuxtPage />
  </UApp>
</template>
