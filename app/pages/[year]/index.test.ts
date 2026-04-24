import { describe, it, expect } from 'vite-plus/test';
import { mountSuspended, registerEndpoint } from '@nuxt/test-utils/runtime';
// @ts-expect-error type declarations
import YearPage from './index.vue';

const globalStubs = {
  NuxtLink: {
    name: 'NuxtLink',
    template: '<a :href="to"><slot /></a>',
    props: ['to'],
  },
  AppHeader: { template: '<div />' },
  AppFooter: { template: '<div />' },
};

describe('[year]/index.vue', () => {
  const mockSpeakers = [
    {
      year: '2024',
      name: ['John Doe', 'Jane Smith'],
      title: 'Vue.js Advanced',
      url: 'https://example.com/talk1',
    },
    {
      year: '2024',
      name: ['Alice Johnson'],
      title: 'Nuxt 3 Deep Dive',
      url: 'https://example.com/talk2',
    },
    {
      year: '2024',
      name: ['Bob Wilson'],
      title: 'Composition API Best Practices',
      url: 'https://example.com/talk3',
    },
  ];

  it('年タイトルとスピーカーリストをレンダリングする', async () => {
    registerEndpoint('/api/speakers/2024', () => mockSpeakers);

    const wrapper = await mountSuspended(YearPage, {
      route: '/2024',
      global: { stubs: globalStubs },
    });

    const html = wrapper.html();
    expect(html).toContain('Vue Fes Japan');
    expect(html).toContain('2024');
    expect(html).toContain('公式サイト');
    expect(html).toContain('John Doe');
    expect(html).toContain('Vue.js Advanced');
    expect(html).toContain('Alice Johnson');
    expect(html).toContain('Nuxt 3 Deep Dive');
  });

  it('スピーカーが空の場合でもページをレンダリングする', async () => {
    registerEndpoint('/api/speakers/2024', () => []);

    const wrapper = await mountSuspended(YearPage, {
      route: '/2024',
      global: { stubs: globalStubs },
    });

    const html = wrapper.html();
    expect(html).toContain('Vue Fes Japan');
    expect(html).toContain('2024');
  });

  it('APIレスポンスの件数を表示する', async () => {
    registerEndpoint('/api/speakers/2024', () => mockSpeakers);

    const wrapper = await mountSuspended(YearPage, {
      route: '/2024',
      global: { stubs: globalStubs },
    });

    expect(wrapper.html()).toContain('全 3 発表');
  });

  it('年別ページの見出しを表示する', async () => {
    registerEndpoint('/api/speakers/2024', () => []);

    const wrapper = await mountSuspended(YearPage, {
      route: '/2024',
      global: { stubs: globalStubs },
    });

    expect(wrapper.html()).toContain('Vue Fes Japan');
    expect(wrapper.html()).toContain('2024');
  });
});
