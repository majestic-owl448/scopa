import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import { useSettingsStore } from './store/settingsStore.ts'

import enCommon from './locales/en/common.json'
import enRules from './locales/en/rules.json'
import enGame from './locales/en/game.json'
import enLearn from './locales/en/learn.json'
import enAiReasons from './locales/en/ai_reasons.json'
import itCommon from './locales/it/common.json'
import itRules from './locales/it/rules.json'
import itGame from './locales/it/game.json'
import itLearn from './locales/it/learn.json'
import itAiReasons from './locales/it/ai_reasons.json'

const lang = useSettingsStore.getState().language

i18n.use(initReactI18next).init({
  lng: lang,
  fallbackLng: 'en',
  ns: ['common', 'rules', 'game', 'learn', 'ai_reasons'],
  defaultNS: 'common',
  interpolation: { escapeValue: false },
  resources: {
    en: { common: enCommon, rules: enRules, game: enGame, learn: enLearn, ai_reasons: enAiReasons },
    it: { common: itCommon, rules: itRules, game: itGame, learn: itLearn, ai_reasons: itAiReasons },
  },
})

// Sync language changes from the settings store to i18next
useSettingsStore.subscribe((state, prev) => {
  if (state.language !== prev.language) {
    i18n.changeLanguage(state.language)
  }
})

export default i18n
