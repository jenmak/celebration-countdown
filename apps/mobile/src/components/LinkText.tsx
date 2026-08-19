import { Pressable, StyleSheet, Text } from 'react-native'
import { colors, type } from '../theme/tokens'

type Props = {
  label: string
  onPress: () => void
  align?: 'left' | 'center' | 'right'
}

export function LinkText({ label, onPress, align = 'left' }: Props) {
  return (
    <Pressable
      accessibilityRole="link"
      onPress={onPress}
      hitSlop={8}
      style={({ pressed }) => pressed && styles.pressed}
    >
      <Text style={[styles.text, { textAlign: align }]}>{label}</Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  text: {
    ...type.caption,
    color: colors.accent,
  },
  pressed: {
    opacity: 0.6,
  },
})
