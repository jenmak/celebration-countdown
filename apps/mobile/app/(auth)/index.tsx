import { useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { router, useLocalSearchParams } from 'expo-router'
import { ApiError } from '../../src/api/client'
import { authApi } from '../../src/api/auth'
import { useAuth } from '../../src/auth/AuthContext'
import {
  MIN_PASSWORD_LENGTH,
  validateEmail,
  validatePassword,
  validateRequired,
} from '../../src/auth/validation'
import { AuthLayout } from '../../src/components/AuthLayout'
import { Banner } from '../../src/components/Banner'
import { Button } from '../../src/components/Button'
import { LinkText } from '../../src/components/LinkText'
import { SegmentedTabs } from '../../src/components/SegmentedTabs'
import { TextField } from '../../src/components/TextField'
import { colors, space, type } from '../../src/theme/tokens'

type Tab = 'signIn' | 'signUp'

const TABS = [
  { key: 'signIn' as const, label: 'Sign In' },
  { key: 'signUp' as const, label: 'Sign Up' },
]

type Errors = Partial<
  Record<'email' | 'password' | 'firstName' | 'lastName', string>
>

export default function AuthScreen() {
  const params = useLocalSearchParams<{ email?: string; notice?: string }>()
  const { signIn } = useAuth()

  const [tab, setTab] = useState<Tab>('signIn')
  const [email, setEmail] = useState(params.email ?? '')
  const [password, setPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [errors, setErrors] = useState<Errors>({})
  const [formError, setFormError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(params.notice ?? null)
  const [submitting, setSubmitting] = useState(false)

  const isSignUp = tab === 'signUp'

  function switchTab(next: Tab) {
    setTab(next)
    setErrors({})
    setFormError(null)
    setNotice(null)
  }

  function validate(): boolean {
    const next: Errors = {
      email: validateEmail(email),
      password: validatePassword(password),
      ...(isSignUp
        ? {
            firstName: validateRequired(firstName, 'First name'),
            lastName: validateRequired(lastName, 'Last name'),
          }
        : {}),
    }
    const cleaned = Object.fromEntries(
      Object.entries(next).filter(([, value]) => !!value),
    )
    setErrors(cleaned)
    return Object.keys(cleaned).length === 0
  }

  async function submit() {
    setFormError(null)
    setNotice(null)
    if (!validate()) return

    setSubmitting(true)
    try {
      if (isSignUp) {
        const result = await authApi.signup({
          email: email.trim().toLowerCase(),
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          password,
        })

        if (result.userConfirmed) {
          await signIn(email.trim().toLowerCase(), password)
          return
        }

        router.push({
          pathname: '/confirm',
          params: { email: email.trim().toLowerCase() },
        })
        return
      }

      await signIn(email.trim().toLowerCase(), password)
    } catch (error) {
      const message =
        error instanceof ApiError ? error.message : 'Something went wrong.'

      // Cognito reports unverified accounts on login; send them to confirmation.
      if (/not confirmed/i.test(message)) {
        router.push({
          pathname: '/confirm',
          params: { email: email.trim().toLowerCase() },
        })
        return
      }
      setFormError(message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthLayout
      subtitle={isSignUp ? 'Create your account' : 'Sign in to your account'}
      header={<SegmentedTabs tabs={TABS} value={tab} onChange={switchTab} />}
      footer={
        <Text style={styles.footerText}>
          {isSignUp
            ? 'Already have an account? '
            : "Don't have an account? "}
          <Text
            style={styles.footerLink}
            onPress={() => switchTab(isSignUp ? 'signIn' : 'signUp')}
          >
            {isSignUp ? 'Sign in' : 'Sign up'}
          </Text>
        </Text>
      }
    >
      {notice ? <Banner tone="success" message={notice} /> : null}
      {formError ? <Banner tone="error" message={formError} /> : null}

      {isSignUp ? (
        <View style={styles.nameRow}>
          <View style={styles.nameCell}>
            <TextField
              label="First name"
              placeholder="Ada"
              autoCapitalize="words"
              autoComplete="given-name"
              textContentType="givenName"
              value={firstName}
              onChangeText={setFirstName}
              error={errors.firstName}
            />
          </View>
          <View style={styles.nameCell}>
            <TextField
              label="Last name"
              placeholder="Lovelace"
              autoCapitalize="words"
              autoComplete="family-name"
              textContentType="familyName"
              value={lastName}
              onChangeText={setLastName}
              error={errors.lastName}
            />
          </View>
        </View>
      ) : null}

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
        label="Password"
        placeholder="••••••••"
        secureTextEntry
        autoCapitalize="none"
        autoComplete={isSignUp ? 'new-password' : 'current-password'}
        textContentType={isSignUp ? 'newPassword' : 'password'}
        value={password}
        onChangeText={setPassword}
        error={errors.password}
        accessory={
          isSignUp ? null : (
            <LinkText
              label="Forgot password?"
              onPress={() =>
                router.push({
                  pathname: '/forgot-password',
                  params: { email: email.trim().toLowerCase() },
                })
              }
            />
          )
        }
      />

      {isSignUp ? (
        <Text style={styles.hint}>
          Use at least {MIN_PASSWORD_LENGTH} characters.
        </Text>
      ) : null}

      <Button
        label={isSignUp ? 'Create Account' : 'Sign In'}
        onPress={submit}
        loading={submitting}
        style={styles.submit}
      />
    </AuthLayout>
  )
}

const styles = StyleSheet.create({
  nameRow: {
    flexDirection: 'row',
    gap: space.md,
  },
  nameCell: {
    flex: 1,
  },
  hint: {
    ...type.caption,
    fontWeight: '400',
    color: colors.inkSoft,
    marginTop: -space.sm,
  },
  submit: {
    marginTop: space.sm,
  },
  footerText: {
    ...type.body,
    color: colors.inkSoft,
  },
  footerLink: {
    color: colors.accent,
    fontWeight: '700',
  },
})
