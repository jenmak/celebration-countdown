import { useState, type ReactNode } from 'react'
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  type TextInputProps,
} from 'react-native'
import { colors, radius, space, type } from '../theme/tokens'

type Props = TextInputProps & {
  label: string
  /** Rendered on the label row, right aligned (e.g. "Forgot password?"). */
  accessory?: ReactNode
  error?: string
}

export function TextField({ label, accessory, error, ...rest }: Props) {
  const [focused, setFocused] = useState(false)

  return (
    <View style={styles.wrap}>
      <View style={styles.labelRow}>
        <Text style={styles.label}>{label.toUpperCase()}</Text>
        {accessory}
      </View>
      <TextInput
        placeholderTextColor={colors.placeholder}
        style={[
          styles.input,
          focused && styles.inputFocused,
          !!error && styles.inputError,
        ]}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        {...rest}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  )
}

const styles = StyleSheet.create({
  wrap: {
    gap: space.sm,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  label: {
    ...type.label,
    color: colors.label,
  },
  input: {
    ...type.body,
    color: colors.ink,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.md,
    paddingHorizontal: space.md,
    paddingVertical: 15,
  },
  inputFocused: {
    borderColor: colors.accent,
  },
  inputError: {
    borderColor: colors.danger,
  },
  error: {
    ...type.caption,
    color: colors.danger,
  },
})
