import { useState } from 'react'
import { ActivityIndicator, Alert, StyleSheet, Text } from 'react-native'
import { router, useLocalSearchParams } from 'expo-router'
import { ApiError } from '../../../src/api/client'
import {
  countdownFor,
  formatBirthdayDay,
  formatCountdown,
} from '../../../src/birthdays/format'
import { useContacts } from '../../../src/contacts/ContactsContext'
import { BirthdayForm } from '../../../src/components/BirthdayForm'
import { Button } from '../../../src/components/Button'
import { Screen } from '../../../src/components/Screen'
import { colors, space, type } from '../../../src/theme/tokens'

export default function EditBirthdayScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const { getById, status, update, remove } = useContacts()
  const [deleting, setDeleting] = useState(false)

  const contact = id ? getById(id) : undefined

  if (!contact) {
    return (
      <Screen title="Birthday" onBack={() => router.back()}>
        {status === 'loading' ? (
          <ActivityIndicator color={colors.accent} style={styles.loader} />
        ) : (
          <Text style={styles.missing}>
            We couldn't find this birthday. It may have been deleted.
          </Text>
        )}
      </Screen>
    )
  }

  const countdown = countdownFor(contact.birthdate)

  const confirmDelete = () => {
    Alert.alert(
      'Delete birthday?',
      `${contact.fullName} and their wishlist will be removed. This can't be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setDeleting(true)
            remove(contact.id)
              .then(() => router.back())
              .catch((error: unknown) => {
                setDeleting(false)
                Alert.alert(
                  'Could not delete',
                  error instanceof ApiError
                    ? error.message
                    : 'Something went wrong. Please try again.',
                )
              })
          },
        },
      ],
    )
  }

  return (
    <Screen
      title={contact.fullName}
      subtitle={`${formatBirthdayDay(contact.birthdate)} · ${formatCountdown(countdown)} · turning ${countdown.turningAge}`}
      onBack={() => router.back()}
      scrollable
    >
      <BirthdayForm
        initial={contact}
        submitLabel="Save Changes"
        onSubmit={async (input) => {
          await update(contact.id, input)
          router.back()
        }}
        secondaryAction={
          <Button
            label="Delete Birthday"
            variant="danger"
            onPress={confirmDelete}
            loading={deleting}
            style={styles.delete}
          />
        }
      />
    </Screen>
  )
}

const styles = StyleSheet.create({
  loader: {
    marginTop: space.xl,
  },
  missing: {
    ...type.body,
    color: colors.inkSoft,
    textAlign: 'center',
    paddingHorizontal: space.lg,
    marginTop: space.xl,
  },
  delete: {
    marginTop: space.xs,
  },
})
