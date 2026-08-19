import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import { router } from 'expo-router'
import { useContacts } from '../../src/contacts/ContactsContext'
import { Banner } from '../../src/components/Banner'
import { BirthdayRow } from '../../src/components/BirthdayRow'
import { Screen } from '../../src/components/Screen'
import { colors, space, type } from '../../src/theme/tokens'

export default function BirthdaysScreen() {
  const { upcoming, status, error, refreshing, refresh } = useContacts()

  return (
    <Screen
      title="All birthdays"
      subtitle={`${upcoming.length} ${upcoming.length === 1 ? 'person' : 'people'}`}
      onBack={() => router.back()}
      action={
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Add a birthday"
          onPress={() => router.push('/birthday/new')}
          style={({ pressed }) => [styles.addButton, pressed && styles.pressed]}
        >
          <Text style={styles.addButtonText}>Add</Text>
        </Pressable>
      }
    >
      <FlatList
        data={upcoming}
        keyExtractor={(contact) => contact.id}
        contentContainerStyle={styles.content}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => void refresh()}
            tintColor={colors.accent}
          />
        }
        ListHeaderComponent={
          error ? <Banner tone="error" message={error} /> : null
        }
        ListEmptyComponent={
          status === 'loading' ? (
            <ActivityIndicator color={colors.accent} style={styles.loader} />
          ) : (
            <Text style={styles.empty}>
              Nobody here yet. Tap Add to record a birthday.
            </Text>
          )
        }
        renderItem={({ item }) => (
          <BirthdayRow
            contact={item}
            onPress={() => router.push(`/birthday/${item.id}`)}
          />
        )}
      />
    </Screen>
  )
}

const styles = StyleSheet.create({
  content: {
    padding: space.md,
    paddingBottom: space.xxl,
    gap: space.sm,
  },
  separator: {
    height: space.sm,
  },
  addButton: {
    backgroundColor: colors.accent,
    borderRadius: 999,
    paddingHorizontal: space.md,
    paddingVertical: 10,
  },
  addButtonText: {
    ...type.caption,
    fontWeight: '700',
    color: colors.white,
  },
  pressed: {
    opacity: 0.75,
  },
  loader: {
    marginTop: space.xl,
  },
  empty: {
    ...type.body,
    color: colors.inkSoft,
    textAlign: 'center',
    marginTop: space.xl,
  },
})
