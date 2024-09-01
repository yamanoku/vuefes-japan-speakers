<script setup lang="ts">
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
    <main class="pt-6 px-6">
      <NuxtPage />
    </main>
    <FooterComponent />
  </div>
</template>
