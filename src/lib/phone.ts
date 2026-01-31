export const PHONE_BY_LOCALE = {
  en: {
    tel: "+17757502920",
    display: "+1 775-750-2920",
  },
  es: {
    tel: "+17754405342",
    display: "+1 (775) 440-5342",
  },
} as const;

export function getPhone(locale?: string) {
  return PHONE_BY_LOCALE[(locale as keyof typeof PHONE_BY_LOCALE) ?? "en"] ?? PHONE_BY_LOCALE.en;
}
