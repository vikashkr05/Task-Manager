// Minimal i18next stub so src/i18n/index.js doesn't crash in tests.
// The real translations are served by __mocks__/react-i18next.js → useTranslation.
const stub = {
  isInitialized: true,
  language: 'en',
  use: () => stub,
  init: () => Promise.resolve(),
  changeLanguage: jest.fn(),
  t: (key) => key,
};

module.exports = stub;
module.exports.default = stub;
