import { StyleSheet, Text, View } from 'react-native'
import { colors, radius, space, type } from '../theme/tokens'

type Props = {
  tone: 'error' | 'success'
  message: string
}

export function Banner({ tone, message }: Props) {
  return (
    <View style={[styles.wrap, tone === 'error' ? styles.error : styles.success]}>
      <Text
        style={[styles.text, tone === 'error' ? styles.errorText : styles.successText]}
      >
        {message}
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  wrap: {
    borderRadius: radius.sm,
    borderWidth: 1,
    paddingHorizontal: space.md,
    paddingVertical: 12,
  },
  error: {
    backgroundColor: '#FCEEEC',
    borderColor: '#F0CFCA',
  },
  success: {
    backgroundColor: '#EDF4EE',
    borderColor: '#CFE2D4',
  },
  text: {
    ...type.caption,
    fontWeight: '600',
  },
  errorText: {
    color: colors.danger,
  },
  successText: {
    color: colors.success,
  },
})
