import { Stack } from 'expo-router'
import { ContactsProvider } from '../../src/contacts/ContactsContext'
import { colors } from '../../src/theme/tokens'

/** Signing in should always land on the countdown, never a deeper screen. */
export const unstable_settings = { initialRouteName: 'home' }

export default function AppGroupLayout() {
  return (
    <ContactsProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.bg },
        }}
      >
        <Stack.Screen name="home" />
        <Stack.Screen name="birthdays" />
        <Stack.Screen name="birthday/new" options={{ presentation: 'modal' }} />
        <Stack.Screen name="birthday/[id]" />
      </Stack>
    </ContactsProvider>
  )
}
