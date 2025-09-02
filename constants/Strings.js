// i18n.js
import LocalizedStrings from 'react-native-localization';
import english from './locales/en.js';
import malay from './locales/ms.js';

const strings = new LocalizedStrings({
  ms: malay,
  en: english,
  ar: malay,
});

module.exports = strings;

export const ChangeLanguage = languageKey => {
  strings.setLanguage(languageKey);
  forceUpdate();
};
