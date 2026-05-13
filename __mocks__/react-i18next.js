// Manual Jest mock for react-i18next.
// Reads the real English translation file so text-based assertions continue to pass.
const en = require('../src/i18n/en.json');

const get = (obj, key) => {
  const parts = key.split('.');
  let cur = obj;
  for (const p of parts) {
    if (cur && typeof cur === 'object' && p in cur) cur = cur[p];
    else return key; // key not found — return the key itself as a safe fallback
  }
  return typeof cur === 'string' ? cur : key;
};

// Minimal i18n object exposed to components
const i18nStub = {
  language: 'en',
  changeLanguage: jest.fn((lang) => { i18nStub.language = lang; }),
};

module.exports = {
  useTranslation: () => ({
    t: (key, vars) => {
      let str = get(en, key);
      if (vars && typeof str === 'string') {
        Object.entries(vars).forEach(([k, v]) => {
          str = str.replace(new RegExp(`{{${k}}}`, 'g'), String(v));
        });
      }
      return str;
    },
    i18n: i18nStub,
  }),
  Trans: ({ children }) => children,
  initReactI18next: { type: '3rdParty', init: () => {} },
  I18nextProvider: ({ children }) => children,
};
