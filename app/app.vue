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
    }
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
    <footer class="footer">
      <dl>
        <div>
          <dt><b>Reference Code</b></dt>
          <dd>
            <a href="https://github.com/ima1zumi/RubyKaigi-speakers">ima1zumi/RubyKaigi-speakers</a>
          </dd>
        </div>
        <div>
          <dt><b>Reference Source</b></dt>
          <dd>
            <a href="https://github.com/vuejs-jp">Vue.js Japan User Group</a>
          </dd>
        </div>
        <div>
          <dt><b>Source Code</b></dt>
          <dd>
            <a href="https://github.com/yamanoku/vuefes-japan-speakers">yamanoku/vuefes-japan-speakers</a>
          </dd>
        </div>
      </dl>
    </footer>
  </div>
</template>

<style scoped>
.footer {
  dl {
    display: flex;
    flex-direction: column;
    div {
      display: flex;
      flex-wrap: wrap;
      column-gap: 0.5em;
    }
    dd {
      margin-inline-start: 0;
    }
  }
}
</style>
