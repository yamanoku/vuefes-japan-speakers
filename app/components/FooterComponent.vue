<template>
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
      <div>
        <dt><b>Article</b></dt>
        <dd>
          <a href="https://zenn.dev/yamanoku/articles/vuefes-japan-speakers">Vue Fes Japanの歴代スピーカー一覧を見られるページを作った</a>
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
