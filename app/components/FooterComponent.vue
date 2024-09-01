<template>
  <footer class="w-4/5 ms-auto me-auto py-6">
    <dl class="flex flex-col gap-2">
      <div class="flex flex-wrap gap-x-2">
        <dt class="flex items-center gap-1">
          <UIcon name="i-heroicons-solid-academic-cap" />
          Reference Code
        </dt>
        <dd>
          <a class="underline hover:no-underline text-gray-500 dark:text-gray-400" href="https://github.com/ima1zumi/RubyKaigi-speakers" target="_blank">
            ima1zumi/RubyKaigi-speakers
            <UIcon name="i-heroicons-solid-arrow-top-right-on-square" class="ms-1 align-[-0.225rem]" />
          </a>
        </dd>
      </div>
      <div class="flex flex-wrap gap-x-2">
        <dt class="flex items-center gap-1">
          <UIcon name="i-heroicons-solid-academic-cap" />
          Reference Source
        </dt>
        <dd>
          <a class="underline hover:no-underline text-gray-500 dark:text-gray-400" href="https://github.com/vuejs-jp" target="_blank">Vue.js Japan User Group
            <UIcon name="i-heroicons-solid-arrow-top-right-on-square" class="ms-1 align-[-0.225rem]" /></a>
        </dd>
      </div>
      <div class="flex flex-wrap gap-x-2">
        <dt class="flex items-center gap-1">
          <UIcon name="i-heroicons-solid-tag" />
          Source Code
        </dt>
        <dd>
          <a class="underline hover:no-underline text-gray-500 dark:text-gray-400" href="https://github.com/yamanoku/vuefes-japan-speakers" target="_blank">yamanoku/vuefes-japan-speakers
            <UIcon name="i-heroicons-solid-arrow-top-right-on-square" class="ms-1 align-[-0.225rem]" /></a>
        </dd>
      </div>
      <div class="flex flex-wrap gap-x-2">
        <dt class="flex items-center gap-1">
          <UIcon name="i-heroicons-solid-book-open" />
          Article
        </dt>
        <dd>
          <a class="underline hover:no-underline text-gray-500 dark:text-gray-400" href="https://zenn.dev/yamanoku/articles/vuefes-japan-speakers" target="_blank">Vue Fes Japanの歴代スピーカー一覧を見られるページを作った
            <UIcon name="i-heroicons-solid-arrow-top-right-on-square" class="ms-1 align-[-0.225rem]" /></a>
        </dd>
      </div>
    </dl>
  </footer>
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
