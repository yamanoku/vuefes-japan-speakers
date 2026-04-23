type ColorScheme = 'light' | 'dark' | 'system';

const STORAGE_KEY = 'vfjs:color-scheme';

function applyScheme(val: ColorScheme) {
  if (!import.meta.client) return;
  if (val === 'system') {
    document.documentElement.removeAttribute('data-color-scheme');
  } else {
    document.documentElement.setAttribute('data-color-scheme', val);
  }
}

export const useColorScheme = () => {
  const scheme = useState<ColorScheme>('vfjs:color-scheme', () => 'system');

  onMounted(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as ColorScheme | null;
    if (stored === 'light' || stored === 'dark' || stored === 'system') {
      scheme.value = stored;
    }
    applyScheme(scheme.value);
  });

  watch(scheme, (val) => {
    if (import.meta.client) {
      localStorage.setItem(STORAGE_KEY, val);
      applyScheme(val);
    }
  });

  const setScheme = (s: ColorScheme) => {
    scheme.value = s;
  };

  return { scheme, setScheme };
};
