import { Image, StyleSheet, Text, View } from 'react-native'
import { initialsFor } from '../birthdays/format'
import { colors, type } from '../theme/tokens'

type Props = {
  fullName: string
  photoUrl?: string | null
  size?: number
}

export function Avatar({ fullName, photoUrl, size = 44 }: Props) {
  const shape = { width: size, height: size, borderRadius: size / 2 }

  if (photoUrl) {
    return (
      <Image
        source={{ uri: photoUrl }}
        style={[styles.disc, shape]}
        accessibilityLabel={fullName}
      />
    )
  }

  return (
    <View style={[styles.disc, shape]}>
      <Text style={[styles.initials, { fontSize: size * 0.36 }]}>
        {initialsFor(fullName)}
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  disc: {
    backgroundColor: colors.medallion,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    ...type.bodyStrong,
    color: colors.label,
  },
})
