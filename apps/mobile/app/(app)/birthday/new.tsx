import { router } from 'expo-router'
import { useContacts } from '../../../src/contacts/ContactsContext'
import { BirthdayForm } from '../../../src/components/BirthdayForm'
import { Screen } from '../../../src/components/Screen'

export default function NewBirthdayScreen() {
  const { create } = useContacts()

  return (
    <Screen
      title="Add a birthday"
      subtitle="We'll count down to the next one"
      onBack={() => router.back()}
      scrollable
    >
      <BirthdayForm
        submitLabel="Save Birthday"
        onSubmit={async (input) => {
          await create(input)
          router.back()
        }}
      />
    </Screen>
  )
}
