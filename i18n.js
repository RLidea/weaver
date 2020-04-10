const NextI18Next = require('next-i18next').default;

module.exports = new NextI18Next({
  defaultLanguage: process.env.defaultLanguage || 'ko',
  otherLanguages: ['ko', 'en'],
  detection: {
    lookupCookie: 'next-i18next',
    order: ['cookie'],
    caches: ['cookie'],
  },
  strictMode: false,
});
