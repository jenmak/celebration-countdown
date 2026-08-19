import type { ReactNode } from 'react'
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { APP_NAME } from '@celebrationcountdown/shared'
import { CakeMark } from './CakeMark'
import { colors, radius, shadow, space, type } from '../theme/tokens'

type Props = {
  subtitle: string
  /** Rendered flush to the card's top edge, above the padded body. */
  header?: ReactNode
  children: ReactNode
  footer?: ReactNode
}

export function AuthLayout({ subtitle, header, children, footer }: Props) {
  const insets = useSafeAreaInsets()

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        style={styles.flex}
        contentContainerStyle={[
          styles.scroll,
          { paddingTop: insets.top + space.xxl, paddingBottom: insets.bottom + space.xl },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.brand}>
          <CakeMark />
          <Text style={styles.wordmark}>{APP_NAME}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>

        <View style={styles.card}>
          {header}
          <View style={styles.cardBody}>{children}</View>
        </View>

        {footer ? <View style={styles.footer}>{footer}</View> : null}
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  scroll: {
    paddingHorizontal: space.md,
    flexGrow: 1,
  },
  brand: {
    alignItems: 'center',
    gap: space.md,
    marginBottom: space.xl,
  },
  wordmark: {
    ...type.wordmark,
    color: colors.ink,
    textAlign: 'center',
  },
  subtitle: {
    ...type.body,
    color: colors.inkSoft,
    marginTop: -space.sm,
  },
  card: {
    backgroundColor: colors.cardTop,
    borderRadius: radius.lg,
    overflow: 'hidden',
    ...shadow.card,
  },
  cardBody: {
    padding: space.lg,
    gap: space.md,
    backgroundColor: colors.cardBottom,
  },
  footer: {
    marginTop: space.lg,
    alignItems: 'center',
  },
})
