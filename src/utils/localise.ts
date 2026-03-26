import type { LocalisedString } from '../learn/types.ts'
import { useSettingsStore } from '../store/settingsStore.ts'

export function useLocalise() {
  const language = useSettingsStore(s => s.language)
  return function localise(ls: LocalisedString): string {
    return ls[language] ?? ls.en
  }
}
