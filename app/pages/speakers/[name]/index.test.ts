import { describe, it, expect } from 'vite-plus/test';
import { mountSuspended, registerEndpoint } from '@nuxt/test-utils/runtime';
import { clearNuxtData } from '#imports';
import type { AcceptedYear, SpeakerInfo } from '~~/types';
// @ts-expect-error type declarations
import SpeakerNamePage from './index.vue';

type SpeakerWithYear = SpeakerInfo & { year: AcceptedYear };

const globalStubs = {
  NuxtLink: {
    name: 'NuxtLink',
    template: '<a :href="to"><slot /></a>',
    props: ['to'],
  },
  AppHeader: { template: '<div />' },
  AppFooter: { template: '<div />' },
};

const registerSpeakersEndpoint = (speakers: SpeakerWithYear[]) => {
  clearNuxtData('vfjs:all-speakers');
  registerEndpoint('/api/speakers', () => speakers);
};

describe('speakers/[name]/index.vue', () => {
  const mockSpeakers: SpeakerWithYear[] = [
    {
      year: '2024' as AcceptedYear,
      name: ['John Doe'],
      title: 'Vue.js Advanced',
      url: 'https://example.com/talk1',
    },
    {
      year: '2023' as AcceptedYear,
      name: ['John Doe'],
      title: 'Nuxt 3 Deep Dive',
      url: 'https://example.com/talk2',
    },
  ];

  it('スピーカー名とトークを含むページをレンダリングする', async () => {
    registerSpeakersEndpoint(mockSpeakers);

    const wrapper = await mountSuspended(SpeakerNamePage, {
      route: '/speakers/John%20Doe',
      global: { stubs: globalStubs },
    });

    const html = wrapper.html();
    expect(html).toContain('John Doe');
    expect(html).toContain('Vue.js Advanced');
    expect(html).toContain('Nuxt 3 Deep Dive');
    expect(html).toContain('2024');
    expect(html).toContain('2023');
  });

  describe('表示情報', () => {
    it('登壇回数を表示する', async () => {
      registerSpeakersEndpoint(mockSpeakers);

      const wrapper = await mountSuspended(SpeakerNamePage, {
        route: '/speakers/John%20Doe',
        global: { stubs: globalStubs },
      });

      expect(wrapper.html()).toContain('2回登壇');
    });
  });

  describe('異なるスピーカー名', () => {
    it('日本語のスピーカー名を処理する', async () => {
      const speakersJapanese: SpeakerWithYear[] = [
        {
          year: '2024' as AcceptedYear,
          name: ['山田太郎'],
          title: 'Vue.jsの基礎',
          url: 'https://example.com/jp1',
        },
      ];

      registerSpeakersEndpoint(speakersJapanese);

      const wrapper = await mountSuspended(SpeakerNamePage, {
        route: `/speakers/${encodeURIComponent('山田太郎')}`,
        global: { stubs: globalStubs },
      });

      const html = wrapper.html();
      expect(html).toContain('山田太郎');
      expect(html).toContain('Vue.jsの基礎');
      expect(html).toContain('1回登壇');
    });
  });
});
