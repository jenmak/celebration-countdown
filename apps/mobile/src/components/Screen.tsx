import type { ReactNode } from 'react'
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { colors, space, type } from '../theme/tokens'

type Props = {
  title: string
  subtitle?: string
  onBack?: () => void
  /** Rendered on the right of the header row. */
  action?: ReactNode
  /** Wraps children so forms scroll clear of the keyboard. Off for lists. */
  scrollable?: boolean
  children: ReactNode
}

export function Screen({
  title,
  subtitle,
  onBack,
  action,
  scrollable,
  children,
}: Props) {
  const body = scrollable ? (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {children}
      </ScrollView>
    </KeyboardAvoidingView>
  ) : (
    children
  )

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        {onBack ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Go back"
            onPress={onBack}
            hitSlop={12}
            style={({ pressed }) => pressed && styles.pressed}
          >
            <Text style={styles.back}>Back</Text>
          </Pressable>
        ) : null}

        <View style={styles.titleRow}>
          <View style={styles.titleText}>
            <Text style={styles.title}>{title}</Text>
            {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
          </View>
          {action}
        </View>
      </View>

      {body}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  scroll: {
    paddingHorizontal: space.md,
    paddingBottom: space.xxl,
  },
  header: {
    paddingHorizontal: space.md,
    paddingTop: space.md,
    paddingBottom: space.md,
    gap: space.sm,
  },
  back: {
    ...type.caption,
    color: colors.accent,
  },
  pressed: {
    opacity: 0.6,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: space.md,
  },
  titleText: {
    flex: 1,
    gap: 2,
  },
  title: {
    ...type.wordmark,
    fontSize: 26,
    color: colors.ink,
  },
  subtitle: {
    ...type.body,
    color: colors.inkSoft,
  },
})
