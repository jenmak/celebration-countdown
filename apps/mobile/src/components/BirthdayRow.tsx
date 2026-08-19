import { Pressable, StyleSheet, Text, View } from 'react-native'
import type { Contact } from '../api/contacts'
import {
  countdownFor,
  formatBirthdayDay,
  formatCountdown,
} from '../birthdays/format'
import { Avatar } from './Avatar'
import { colors, radius, space, type } from '../theme/tokens'

type Props = {
  contact: Contact
  onPress: () => void
}

export function BirthdayRow({ contact, onPress }: Props) {
  const countdown = countdownFor(contact.birthdate)

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${contact.fullName}, ${formatCountdown(countdown)}`}
      onPress={onPress}
      style={({ pressed }) => [
        styles.row,
        countdown.isToday && styles.rowToday,
        pressed && styles.pressed,
      ]}
    >
      <Avatar fullName={contact.fullName} photoUrl={contact.photoUrl} />

      <View style={styles.body}>
        <Text style={styles.name} numberOfLines={1}>
          {contact.fullName}
        </Text>
        <Text style={styles.meta} numberOfLines={1}>
          {formatBirthdayDay(contact.birthdate)} · turning{' '}
          {countdown.turningAge}
        </Text>
      </View>

      <Text style={[styles.countdown, countdown.isToday && styles.countdownToday]}>
        {formatCountdown(countdown)}
      </Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md,
    backgroundColor: colors.cardTop,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.md,
    padding: space.md,
  },
  rowToday: {
    borderColor: colors.accent,
    backgroundColor: colors.accentSoft,
  },
  pressed: {
    opacity: 0.7,
  },
  body: {
    flex: 1,
    gap: 2,
  },
  name: {
    ...type.bodyStrong,
    color: colors.ink,
  },
  meta: {
    ...type.caption,
    fontWeight: '400',
    color: colors.inkSoft,
  },
  countdown: {
    ...type.caption,
    color: colors.label,
    textAlign: 'right',
  },
  countdownToday: {
    color: colors.accent,
    fontWeight: '700',
  },
})
