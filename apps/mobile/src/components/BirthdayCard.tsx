import { Pressable, StyleSheet, Text, View } from 'react-native'
import type { Contact } from '../api/contacts'
import {
  RELATIONSHIP_LABELS,
  countdownFor,
  formatBirthdayDay,
  formatCountdown,
} from '../birthdays/format'
import { Avatar } from './Avatar'
import { CakeMark } from './CakeMark'
import { colors, radius, shadow, space, type } from '../theme/tokens'

type Props = {
  contact: Contact
  onPress: () => void
}

/** Hero treatment for whoever's birthday lands next. */
export function BirthdayCard({ contact, onPress }: Props) {
  const countdown = countdownFor(contact.birthdate)

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${contact.fullName}, ${formatCountdown(countdown)}`}
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <View style={styles.header}>
        <CakeMark size={56} />
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{formatCountdown(countdown)}</Text>
        </View>
      </View>

      <Text style={styles.name}>{contact.fullName}</Text>
      <Text style={styles.meta}>
        Turning {countdown.turningAge} on {formatBirthdayDay(contact.birthdate)}
      </Text>

      <View style={styles.footer}>
        <Avatar
          fullName={contact.fullName}
          photoUrl={contact.photoUrl}
          size={28}
        />
        <Text style={styles.relationship}>
          {RELATIONSHIP_LABELS[contact.relationship] ?? contact.relationship}
        </Text>
      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.cardBottom,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.line,
    padding: space.lg,
    gap: space.sm,
    ...shadow.card,
  },
  pressed: {
    opacity: 0.85,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: space.sm,
  },
  badge: {
    backgroundColor: colors.accent,
    borderRadius: radius.pill,
    paddingHorizontal: space.md,
    paddingVertical: 6,
  },
  badgeText: {
    ...type.caption,
    fontWeight: '700',
    color: colors.white,
  },
  name: {
    ...type.wordmark,
    fontSize: 24,
    color: colors.ink,
  },
  meta: {
    ...type.body,
    color: colors.inkSoft,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
    marginTop: space.sm,
  },
  relationship: {
    ...type.caption,
    color: colors.label,
  },
})
