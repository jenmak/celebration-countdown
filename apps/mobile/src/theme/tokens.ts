import { Platform } from 'react-native'

export const colors = {
  bg: '#FFFFFF',
  cardTop: '#FFFEFB',
  cardBottom: '#FDF6EC',
  tabInactive: '#EFE4D3',
  tabActive: '#FFFFFF',
  ink: '#6B6321',
  inkSoft: '#8C8452',
  label: '#8A7B57',
  placeholder: '#C3B69A',
  accent: '#CC5A04',
  accentPressed: '#AE4C03',
  accentSoft: '#FBEEE2',
  line: '#EADFCC',
  lineStrong: '#DCCFB6',
  medallion: '#F6EDDF',
  danger: '#B3261E',
  success: '#3F6B4A',
  white: '#FFFFFF',
} as const

export const space = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const

export const radius = {
  sm: 10,
  md: 14,
  lg: 20,
  pill: 999,
} as const

/** Wordmark uses a serif face to match the brand lockup. */
export const serif = Platform.select({
  ios: 'Georgia',
  android: 'serif',
  default: 'serif',
})

export const type = {
  wordmark: {
    fontFamily: serif,
    fontSize: 30,
    fontWeight: '700' as const,
    letterSpacing: -0.2,
  },
  title: { fontSize: 22, fontWeight: '700' as const },
  tab: { fontSize: 15, fontWeight: '700' as const },
  body: { fontSize: 15, fontWeight: '400' as const },
  bodyStrong: { fontSize: 16, fontWeight: '700' as const },
  label: { fontSize: 11, fontWeight: '700' as const, letterSpacing: 1 },
  caption: { fontSize: 13, fontWeight: '600' as const },
}

export const shadow = {
  card: {
    shadowColor: '#8A7B57',
    shadowOpacity: 0.14,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 4,
  },
}
