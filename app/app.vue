<script setup lang="ts">
import 'yama-normalize';
import FooterComponent from '~/components/FooterComponent.vue';

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
  titleTemplate: (title) => {
    return title
      ? `${title} - Vue Fes Japan Speakers`
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

useSeoMeta({
  twitterCard: 'summary_large_image',
});
</script>

<template>
  <div>
    <NuxtRouteAnnouncer />
    <NuxtLoadingIndicator />
    <main>
      <NuxtPage />
    </main>
    <FooterComponent />
  </div>
</template>
