import { StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useAuth } from '../../src/auth/AuthContext'
import { Button } from '../../src/components/Button'
import { CakeMark } from '../../src/components/CakeMark'
import { colors, space, type } from '../../src/theme/tokens'

export default function HomeScreen() {
  const { user, signOut } = useAuth()

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.content}>
        <CakeMark />
        <Text style={styles.greeting}>
          Welcome{user?.firstName ? `, ${user.firstName}` : ''}
        </Text>
        <Text style={styles.body}>
          You're signed in. Birthdays and wishlists land here next.
        </Text>
      </View>
      <Button label="Sign Out" variant="secondary" onPress={() => void signOut()} />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.bg,
    padding: space.lg,
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: space.md,
  },
  greeting: {
    ...type.wordmark,
    fontSize: 26,
    color: colors.ink,
    textAlign: 'center',
  },
  body: {
    ...type.body,
    color: colors.inkSoft,
    textAlign: 'center',
  },
})
