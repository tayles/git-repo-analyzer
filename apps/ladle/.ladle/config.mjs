/** @type {import('@ladle/react').UserConfig} */
export default {
  defaultStory: 'welcome--introduction',
  viteConfig: process.cwd() + '/vite.config.ts',
  base: '/',
  mode: 'full',
  appendToHead: '',
  addons: {
    a11y: {
      enabled: true,
    },
    action: {
      enabled: true,
    },
    control: {
      enabled: true,
    },
    ladle: {
      enabled: true,
    },
    mode: {
      enabled: true,
    },
    rtl: {
      enabled: true,
    },
    source: {
      enabled: true,
    },
    theme: {
      enabled: true,
      defaultState: 'auto',
    },
    width: {
      enabled: true,
    },
  },
};
