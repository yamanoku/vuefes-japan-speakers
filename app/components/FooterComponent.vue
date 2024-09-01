<template>
  <footer class="w-4/5 ms-auto me-auto py-6">
    <dl>
      <div class="flex flex-wrap gap-2.5">
        <dt><b>Reference Code</b></dt>
        <dd>
          <a class="underline hover:no-underline text-gray-500 dark:text-gray-400" href="https://github.com/ima1zumi/RubyKaigi-speakers" target="_blank">ima1zumi/RubyKaigi-speakers</a>
        </dd>
      </div>
      <div class="flex flex-wrap gap-2.5">
        <dt><b>Reference Source</b></dt>
        <dd>
          <a class="underline hover:no-underline text-gray-500 dark:text-gray-400" href="https://github.com/vuejs-jp" target="_blank">Vue.js Japan User Group</a>
        </dd>
      </div>
      <div class="flex flex-wrap gap-2.5">
        <dt><b>Source Code</b></dt>
        <dd>
          <a class="underline hover:no-underline text-gray-500 dark:text-gray-400" href="https://github.com/yamanoku/vuefes-japan-speakers" target="_blank">yamanoku/vuefes-japan-speakers</a>
        </dd>
      </div>
      <div class="flex flex-wrap gap-2.5">
        <dt><b>Article</b></dt>
        <dd>
          <a class="underline hover:no-underline text-gray-500 dark:text-gray-400" href="https://zenn.dev/yamanoku/articles/vuefes-japan-speakers" target="_blank">Vue Fes Japanの歴代スピーカー一覧を見られるページを作った</a>
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
