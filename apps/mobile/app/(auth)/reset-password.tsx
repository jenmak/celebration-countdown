import { useState } from 'react'
import { StyleSheet } from 'react-native'
import { router, useLocalSearchParams } from 'expo-router'
import { authApi } from '../../src/api/auth'
import { ApiError } from '../../src/api/client'
import {
  validateCode,
  validateEmail,
  validatePassword,
} from '../../src/auth/validation'
import { AuthLayout } from '../../src/components/AuthLayout'
import { Banner } from '../../src/components/Banner'
import { Button } from '../../src/components/Button'
import { LinkText } from '../../src/components/LinkText'
import { TextField } from '../../src/components/TextField'
import { space } from '../../src/theme/tokens'

type Errors = Partial<Record<'email' | 'code' | 'newPassword', string>>

export default function ResetPasswordScreen() {
  const params = useLocalSearchParams<{ email?: string }>()

  const [email, setEmail] = useState(params.email ?? '')
  const [code, setCode] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [errors, setErrors] = useState<Errors>({})
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  async function submit() {
    const next: Errors = {
      email: validateEmail(email),
      code: validateCode(code),
      newPassword: validatePassword(newPassword),
    }
    const cleaned = Object.fromEntries(
      Object.entries(next).filter(([, value]) => !!value),
    )
    setErrors(cleaned)
    setError(null)
    if (Object.keys(cleaned).length > 0) return

    setSubmitting(true)
    const normalized = email.trim().toLowerCase()
    try {
      await authApi.confirmForgotPassword({
        email: normalized,
        code: code.trim(),
        newPassword,
      })
      router.replace({
        pathname: '/',
        params: {
          email: normalized,
          notice: 'Password updated. Sign in with your new password.',
        },
      })
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Something went wrong.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthLayout
      subtitle="Choose a new password"
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
        error={errors.email}
      />

      <TextField
        label="Reset code"
        placeholder="123456"
        keyboardType="number-pad"
        autoComplete="one-time-code"
        textContentType="oneTimeCode"
        value={code}
        onChangeText={setCode}
        error={errors.code}
      />

      <TextField
        label="New password"
        placeholder="••••••••"
        secureTextEntry
        autoCapitalize="none"
        autoComplete="new-password"
        textContentType="newPassword"
        value={newPassword}
        onChangeText={setNewPassword}
        error={errors.newPassword}
      />

      <Button
        label="Reset Password"
        onPress={submit}
        loading={submitting}
        style={styles.submit}
      />
    </AuthLayout>
  )
}

const styles = StyleSheet.create({
  submit: {
    marginTop: space.sm,
  },
})
