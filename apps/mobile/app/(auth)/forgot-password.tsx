import { useState } from 'react'
import { StyleSheet } from 'react-native'
import { router, useLocalSearchParams } from 'expo-router'
import { authApi } from '../../src/api/auth'
import { ApiError } from '../../src/api/client'
import { validateEmail } from '../../src/auth/validation'
import { AuthLayout } from '../../src/components/AuthLayout'
import { Banner } from '../../src/components/Banner'
import { Button } from '../../src/components/Button'
import { LinkText } from '../../src/components/LinkText'
import { TextField } from '../../src/components/TextField'
import { space } from '../../src/theme/tokens'

export default function ForgotPasswordScreen() {
  const params = useLocalSearchParams<{ email?: string }>()

  const [email, setEmail] = useState(params.email ?? '')
  const [fieldError, setFieldError] = useState<string | undefined>()
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  async function submit() {
    const invalid = validateEmail(email)
    setFieldError(invalid)
    setError(null)
    if (invalid) return

    setSubmitting(true)
    const normalized = email.trim().toLowerCase()
    try {
      await authApi.forgotPassword({ email: normalized })
      router.push({ pathname: '/reset-password', params: { email: normalized } })
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Something went wrong.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthLayout
      subtitle="We'll email you a reset code"
      footer={<LinkText label="Back to sign in" onPress={() => router.replace('/')} />}
    >
      {error ? <Banner tone="error" message={error} /> : null}

      <TextField
        label="Email"
        placeholder="you@example.com"
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        autoComplete="email"
        textContentType="emailAddress"
        value={email}
        onChangeText={setEmail}
        error={fieldError}
      />

      <Button
        label="Send Reset Code"
        onPress={submit}
        loading={submitting}
        style={styles.submit}
      />
      <Button
        label="I already have a code"
        variant="ghost"
        onPress={() =>
          router.push({
            pathname: '/reset-password',
            params: { email: email.trim().toLowerCase() },
          })
        }
      />
    </AuthLayout>
  )
}

const styles = StyleSheet.create({
  submit: {
    marginTop: space.sm,
  },
})
