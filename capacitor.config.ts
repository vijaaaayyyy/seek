import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.seek.bible',
  appName: 'Seek',
  webDir: 'dist',
  server: {
    url: 'https://seek-bible.vercel.app',
    cleartext: false,
  },
};

export default config;