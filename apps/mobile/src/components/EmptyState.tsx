import { StyleSheet, Text, View } from 'react-native'
import { CakeMark } from './CakeMark'
import { colors, space, type } from '../theme/tokens'

type Props = {
  title: string
  body: string
}

export function EmptyState({ title, body }: Props) {
  return (
    <View style={styles.wrap}>
      <CakeMark size={64} />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.body}>{body}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    gap: space.sm,
    paddingVertical: space.xl,
  },
  title: {
    ...type.bodyStrong,
    color: colors.ink,
    marginTop: space.sm,
  },
  body: {
    ...type.body,
    color: colors.inkSoft,
    textAlign: 'center',
  },
})
