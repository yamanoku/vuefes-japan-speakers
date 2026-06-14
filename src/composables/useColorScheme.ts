import { onMounted, ref, watch } from "vue";

type ColorScheme = "light" | "dark" | "system";

const STORAGE_KEY = "vfjs:color-scheme";
const scheme = ref<ColorScheme>("system");

function applyScheme(value: ColorScheme) {
  if (typeof document === "undefined") return;
  if (value === "system") {
    document.documentElement.removeAttribute("data-color-scheme");
  } else {
    document.documentElement.setAttribute("data-color-scheme", value);
  }
}

export const useColorScheme = () => {
  onMounted(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as ColorScheme | null;
    if (stored === "light" || stored === "dark" || stored === "system") {
      scheme.value = stored;
    }
    applyScheme(scheme.value);
  });

  watch(scheme, (value) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, value);
      applyScheme(value);
    }
  });

  const setScheme = (value: ColorScheme) => {
    scheme.value = value;
  };

  return { scheme, setScheme };
};
