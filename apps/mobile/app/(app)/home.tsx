import { UPCOMING_BIRTHDAY_LIMIT } from '@celebrationcountdown/shared'
import { router } from 'expo-router'
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useAuth } from '../../src/auth/AuthContext'
import { Banner } from '../../src/components/Banner'
import { BirthdayCard } from '../../src/components/BirthdayCard'
import { BirthdayRow } from '../../src/components/BirthdayRow'
import { Button } from '../../src/components/Button'
import { EmptyState } from '../../src/components/EmptyState'
import { LinkText } from '../../src/components/LinkText'
import { Screen } from '../../src/components/Screen'
import { useContacts } from '../../src/contacts/ContactsContext'
import { colors, space } from '../../src/theme/tokens'

export default function HomeScreen() {
  const { user, signOut } = useAuth()
  const { upcoming, status, error, refreshing, refresh } = useContacts()
  const insets = useSafeAreaInsets()

  const next = upcoming.slice(0, UPCOMING_BIRTHDAY_LIMIT)
  const [soonest, ...rest] = next

  function renderContent() {
    if (status === 'loading') {
      return <ActivityIndicator color={colors.accent} style={styles.loader} />
    }

    if (!next.length) {
      return (
        <EmptyState
          title="No birthdays yet"
          body="Add the people you celebrate and we'll count down to their big day."
        />
      )
    }

    return (
      <View style={styles.list}>
        <BirthdayCard
          contact={soonest}
          onPress={() => router.push(`/birthday/${soonest.id}`)}
        />
        {rest.map((contact) => (
          <BirthdayRow
            key={contact.id}
            contact={contact}
            onPress={() => router.push(`/birthday/${contact.id}`)}
          />
        ))}
      </View>
    )
  }

  return (
    <Screen
      title={`Welcome${user?.firstName ? `, ${user.firstName}` : ''}`}
      subtitle="Upcoming birthdays"
      action={<LinkText label="Sign out" onPress={() => void signOut()} />}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => void refresh()}
            tintColor={colors.accent}
          />
        }
      >
        {error ? <Banner tone="error" message={error} /> : null}
        {renderContent()}
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + space.md }]}>
        <Button
          label="Add a Birthday"
          onPress={() => router.push('/birthday/new')}
        />
        {upcoming.length ? (
          <LinkText
            label={`See all ${upcoming.length} birthdays`}
            align="center"
            onPress={() => router.push('/birthdays')}
          />
        ) : null}
      </View>
    </Screen>
  )
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: space.md,
    paddingBottom: space.lg,
    gap: space.md,
  },
  list: {
    gap: space.sm,
  },
  loader: {
    marginTop: space.xl,
  },
  footer: {
    padding: space.md,
    gap: space.md,
  },
})
