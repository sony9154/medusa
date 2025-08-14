import { InitOptions } from "i18next"

import translations from "./translations"

export const defaultI18nOptions: InitOptions = {
  debug: process.env.NODE_ENV === "development",
  lng: "zhTW",
  detection: {
    caches: ["cookie", "localStorage", "header"],
    lookupCookie: "lng",
    lookupLocalStorage: "lng",
    order: ["cookie", "localStorage", "header"],
  },
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
  resources: translations,
  supportedLngs: Object.keys(translations),
}
