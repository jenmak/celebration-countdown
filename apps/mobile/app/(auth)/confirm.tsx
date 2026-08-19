import { useState } from 'react'
import { StyleSheet } from 'react-native'
import { router, useLocalSearchParams } from 'expo-router'
import { authApi } from '../../src/api/auth'
import { ApiError } from '../../src/api/client'
import { validateCode } from '../../src/auth/validation'
import { AuthLayout } from '../../src/components/AuthLayout'
import { Banner } from '../../src/components/Banner'
import { Button } from '../../src/components/Button'
import { LinkText } from '../../src/components/LinkText'
import { TextField } from '../../src/components/TextField'
import { space } from '../../src/theme/tokens'

export default function ConfirmScreen() {
  const params = useLocalSearchParams<{ email?: string }>()
  const email = (params.email ?? '').toLowerCase()

  const [code, setCode] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [fieldError, setFieldError] = useState<string | undefined>()
  const [notice, setNotice] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [resending, setResending] = useState(false)

  async function confirm() {
    const invalid = validateCode(code)
    setFieldError(invalid)
    setError(null)
    setNotice(null)
    if (invalid) return

    setSubmitting(true)
    try {
      await authApi.confirmSignUp({ email, code: code.trim() })
      router.replace({
        pathname: '/',
        params: { email, notice: 'Account confirmed. Sign in to continue.' },
      })
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Something went wrong.')
    } finally {
      setSubmitting(false)
    }
  }

  async function resend() {
    setError(null)
    setNotice(null)
    setResending(true)
    try {
      await authApi.resendConfirmation({ email })
      setNotice('We sent a new code to your email.')
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Something went wrong.')
    } finally {
      setResending(false)
    }
  }

  return (
    <AuthLayout
      subtitle={email ? `Enter the code sent to ${email}` : 'Confirm your account'}
      footer={<LinkText label="Back to sign in" onPress={() => router.replace('/')} />}
    >
      {notice ? <Banner tone="success" message={notice} /> : null}
      {error ? <Banner tone="error" message={error} /> : null}

      <TextField
        label="Confirmation code"
        placeholder="123456"
        keyboardType="number-pad"
        autoComplete="one-time-code"
        textContentType="oneTimeCode"
        value={code}
        onChangeText={setCode}
        error={fieldError}
      />

      <Button
        label="Confirm Account"
        onPress={confirm}
        loading={submitting}
        style={styles.submit}
      />
      <Button
        label="Resend code"
        variant="ghost"
        onPress={resend}
        loading={resending}
      />
    </AuthLayout>
  )
}

const styles = StyleSheet.create({
  submit: {
    marginTop: space.sm,
  },
})
