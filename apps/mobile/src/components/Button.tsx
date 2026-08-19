import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  type PressableProps,
} from 'react-native'
import { colors, radius, space, type } from '../theme/tokens'

type Props = Omit<PressableProps, 'children'> & {
  label: string
  loading?: boolean
  variant?: 'primary' | 'secondary' | 'ghost'
}

export function Button({
  label,
  loading,
  variant = 'primary',
  disabled,
  style,
  ...rest
}: Props) {
  const isDisabled = disabled || loading
  const isFilled = variant === 'primary'

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: !!isDisabled, busy: !!loading }}
      disabled={isDisabled}
      {...rest}
      style={(state) => [
        styles.base,
        variant === 'primary' && styles.primary,
        variant === 'secondary' && styles.secondary,
        variant === 'ghost' && styles.ghost,
        state.pressed && !isDisabled && isFilled && styles.primaryPressed,
        state.pressed && !isDisabled && !isFilled && styles.pressedSoft,
        isDisabled && styles.disabled,
        typeof style === 'function' ? style(state) : style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={isFilled ? colors.white : colors.accent} />
      ) : (
        <Text style={[styles.label, !isFilled && styles.labelAccent]}>
          {label}
        </Text>
      )}
    </Pressable>
  )
}

const styles = StyleSheet.create({
  base: {
    minHeight: 52,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: space.lg,
  },
  primary: {
    backgroundColor: colors.accent,
  },
  primaryPressed: {
    backgroundColor: colors.accentPressed,
  },
  secondary: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.lineStrong,
  },
  ghost: {
    backgroundColor: 'transparent',
    minHeight: 44,
  },
  pressedSoft: {
    opacity: 0.7,
  },
  disabled: {
    opacity: 0.45,
  },
  label: {
    ...type.bodyStrong,
    color: colors.white,
  },
  labelAccent: {
    color: colors.accent,
  },
})
