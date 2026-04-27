<script setup lang="ts">
import AppLogoMark from "./AppLogoMark.vue";
import { useColorScheme } from "../composables/useColorScheme";
import { useVfjsI18n } from "../composables/useVfjsI18n";

const { lang, setLang, t } = useVfjsI18n();
const { scheme, setScheme } = useColorScheme();
</script>

<template>
  <!-- サイト全体のヘッダー（スクロール時にページ上部へ固定） -->
  <header
    class="border-b border-rule bg-paper sticky top-0 z-20"
    style="backdrop-filter: saturate(1.1)"
    role="banner"
  >
    <div class="flex flex-wrap justify-between items-center gap-2 py-[14px] px-pad-x">
      <!-- ロゴマーク＋サイト名（トップページへのリンク） -->
      <a
        href="/"
        class="flex items-center gap-[10px] font-display font-semibold text-[15px] whitespace-nowrap leading-[1.15] text-ink no-underline hover:text-accent transition-colors"
      >
        <AppLogoMark class="w-4 h-auto text-ink" />
        <span>Vue Fes Japan Speakers</span>
      </a>

      <!-- ヘッダー右側のコントロール群 -->
      <div class="flex items-center gap-2">
        <!-- カラースキーム切り替えセレクト（ライト／ダーク／システム） -->
        <select
          class="border border-rule bg-paper text-ink-2 font-mono text-[12px] tracking-[0.08em] px-2 py-[5px] cursor-pointer"
          :aria-label="t.color_scheme"
          :value="scheme"
          @change="
            setScheme(($event.target as HTMLSelectElement).value as 'light' | 'dark' | 'system')
          "
        >
          <option value="light">{{ t.color_scheme_light }}</option>
          <option value="dark">{{ t.color_scheme_dark }}</option>
          <option value="system" selected>{{ t.color_scheme_system }}</option>
        </select>
        <!-- 言語切り替えボタングループ（JA／EN） -->
        <div
          class="inline-flex border border-rule font-mono text-[12px] tracking-[0.08em]"
          role="group"
          :aria-label="t.language"
        >
          <!-- 日本語切り替えボタン -->
          <button
            type="button"
            class="px-[10px] py-[5px] cursor-pointer"
            :class="lang === 'ja' ? 'bg-ink text-paper' : 'text-ink-2'"
            :aria-pressed="lang === 'ja' ? 'true' : 'false'"
            @click="setLang('ja')"
          >
            JA
          </button>
          <!-- 英語切り替えボタン -->
          <button
            type="button"
            class="px-[10px] py-[5px] cursor-pointer border-l border-rule"
            :class="lang === 'en' ? 'bg-ink text-paper' : 'text-ink-2'"
            :aria-pressed="lang === 'en' ? 'true' : 'false'"
            @click="setLang('en')"
          >
            EN
          </button>
        </div>
      </div>
    </div>
  </header>
</template>
