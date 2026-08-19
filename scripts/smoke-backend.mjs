/**
 * One-shot backend smoke test: signup → facets → wishlist.
 * Run: node scripts/smoke-backend.mjs
 */
import { createHash } from 'node:crypto'
import { writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { config as loadEnv } from 'dotenv'
import {
  AdminConfirmSignUpCommand,
  CognitoIdentityProviderClient,
} from '@aws-sdk/client-cognito-identity-provider'

loadEnv({ path: resolve('apps/backend/.env.development') })

const BASE = process.env.SMOKE_BASE_URL || 'http://127.0.0.1:3001/v1'
const EMAIL = `e2e.${Date.now()}@example.com`
const PASS = 'TestPass1!'
const results = []

function cognitoUsernameFromEmail(email) {
  const hash = createHash('sha256')
    .update(email.trim().toLowerCase())
    .digest('hex')
    .slice(0, 32)
  return `u_${hash}`
}

async function req(name, method, path, { body, token, formData } = {}) {
  const headers = {}
  if (token) headers.Authorization = `Bearer ${token}`
  let payload
  if (formData) {
    payload = formData
  } else if (body !== undefined) {
    headers['Content-Type'] = 'application/json'
    payload = JSON.stringify(body)
  }
  const res = await fetch(`${BASE}${path}`, { method, headers, body: payload })
  const text = await res.text()
  let json = null
  try {
    json = text ? JSON.parse(text) : null
  } catch {
    json = { raw: text }
  }
  const row = {
    name,
    method,
    path,
    status: res.status,
    ok: res.ok,
    message: json?.message ?? null,
    data: json?.data ?? json,
  }
  results.push(row)
  const summary = {
    name,
    status: res.status,
    ok: res.ok,
    message: Array.isArray(row.message) ? row.message.join(', ') : row.message,
  }
  console.log(JSON.stringify(summary))
  if (!res.ok) {
    console.log('  detail:', JSON.stringify(json)?.slice(0, 500))
  }
  return row
}

async function main() {
  console.log('BASE', BASE)
  console.log('EMAIL', EMAIL)

  await req('health', 'GET', '/')

  await req('signup', 'POST', '/auth/signup', {
    body: {
      email: EMAIL,
      firstName: 'E2E',
      lastName: 'Tester',
      password: PASS,
    },
  })

  // Confirm without email inbox
  const cognito = new CognitoIdentityProviderClient({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY,
      secretAccessKey: process.env.AWS_SECRET,
    },
  })
  const username = cognitoUsernameFromEmail(EMAIL)
  try {
    await cognito.send(
      new AdminConfirmSignUpCommand({
        UserPoolId: process.env.COGNITO_USER_POOL_ID,
        Username: username,
      }),
    )
    results.push({
      name: 'admin-confirm-signup',
      method: 'AWS',
      path: 'AdminConfirmSignUp',
      status: 200,
      ok: true,
      message: 'confirmed',
      data: { username },
    })
    console.log(JSON.stringify({ name: 'admin-confirm-signup', status: 200, ok: true }))
  } catch (err) {
    results.push({
      name: 'admin-confirm-signup',
      method: 'AWS',
      path: 'AdminConfirmSignUp',
      status: 500,
      ok: false,
      message: err?.message || String(err),
      data: null,
    })
    console.log(
      JSON.stringify({
        name: 'admin-confirm-signup',
        status: 500,
        ok: false,
        message: err?.message || String(err),
      }),
    )
  }

  // confirm-signup with bad code should fail gracefully (optional path)
  await req('confirm-signup-bad-code', 'POST', '/auth/confirm-signup', {
    body: { email: EMAIL, code: '000000' },
  })

  const login = await req('login', 'POST', '/auth/login', {
    body: { email: EMAIL, password: PASS },
  })
  const accessToken = login.data?.accessToken
  const refreshToken = login.data?.refreshToken
  if (!accessToken) {
    throw new Error('Login failed — cannot continue authenticated tests')
  }

  await req('me', 'GET', '/auth/me', { token: accessToken })

  const refresh = await req('refresh', 'POST', '/auth/refresh', {
    body: { refreshToken },
  })
  const token = refresh.data?.accessToken || accessToken

  await req('forgot-password', 'POST', '/auth/forgot-password', {
    body: { email: EMAIL },
  })

  // confirm-forgot with bogus code — expect failure
  await req('confirm-forgot-password-bad', 'POST', '/auth/confirm-forgot-password', {
    body: { email: EMAIL, code: '000000', newPassword: 'TestPass2!' },
  })

  const contact = await req('contact-create', 'POST', '/contact', {
    token,
    body: {
      fullName: 'Alex Rivera',
      birthdate: '1990-08-15',
      relationship: 'FRIEND',
      notes:
        'Loves hiking, pour-over coffee, and compact travel gadgets. Budget around $40. Prefers REI and Patagonia brands.',
    },
  })
  const contactId = contact.data?.id
  if (!contactId) throw new Error('Contact create failed')

  await req('contact-list', 'GET', '/contact', { token })
  await req('contact-get', 'GET', `/contact/${contactId}`, { token })
  await req('contact-update', 'PATCH', `/contact/${contactId}`, {
    token,
    body: {
      notes:
        'Loves hiking, pour-over coffee, compact travel gadgets, and noise-cancelling earbuds. Budget under $50.',
    },
  })

  // tiny 1x1 png
  const png = Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
    'base64',
  )
  const form = new FormData()
  form.append('file', new Blob([png], { type: 'image/png' }), 'dot.png')
  await req('contact-photo', 'POST', `/contact/${contactId}/photo`, {
    token,
    formData: form,
  })

  const facets = await req(
    'gift-facets',
    'POST',
    `/contact/${contactId}/gift-facets`,
    { token },
  )

  // cached second call
  await req('gift-facets-cached', 'POST', `/contact/${contactId}/gift-facets`, {
    token,
  })

  // Pick a search URL from facets if present, else use a placeholder ASIN URL
  const firstFacet = facets.data?.facets?.[0]
  const amazonUrl =
    firstFacet?.searchUrl ||
    'https://www.amazon.com/dp/B0BSHF7WHW?tag=example-20'

  const item = await req('wishlist-create', 'POST', `/contact/${contactId}/wishlist`, {
    token,
    body: {
      productName: firstFacet?.label || 'Trail coffee mug',
      amazonUrl,
      brand: firstFacet?.filters?.brand || 'Generic',
      price: firstFacet?.filters?.maxPriceUsd || 29.99,
    },
  })
  const itemId = item.data?.id
  if (!itemId) throw new Error('Wishlist create failed')

  await req('wishlist-list', 'GET', `/contact/${contactId}/wishlist`, { token })
  await req('wishlist-get', 'GET', `/contact/${contactId}/wishlist/${itemId}`, {
    token,
  })
  await req('wishlist-update', 'PATCH', `/contact/${contactId}/wishlist/${itemId}`, {
    token,
    body: { productName: 'Updated gift pick' },
  })
  await req('wishlist-status-cart', 'POST', `/contact/${contactId}/wishlist/${itemId}/status`, {
    token,
    body: { purchaseStatus: 'IN_CART' },
  })
  await req('wishlist-purchase', 'POST', `/contact/${contactId}/wishlist/${itemId}/purchase`, {
    token,
  })
  await req(
    'wishlist-unpurchase',
    'POST',
    `/contact/${contactId}/wishlist/${itemId}/unpurchase`,
    { token },
  )
  await req('wishlist-status-purchased', 'POST', `/contact/${contactId}/wishlist/${itemId}/status`, {
    token,
    body: { purchaseStatus: 'PURCHASED' },
  })

  // second wishlist item from another facet if available
  const secondFacet = facets.data?.facets?.[1]
  if (secondFacet?.searchUrl) {
    await req('wishlist-create-from-facet-2', 'POST', `/contact/${contactId}/wishlist`, {
      token,
      body: {
        productName: secondFacet.label,
        amazonUrl: secondFacet.searchUrl,
      },
    })
  }

  await req('wishlist-delete', 'DELETE', `/contact/${contactId}/wishlist/${itemId}`, {
    token,
  })

  await req('resend-confirmation-existing', 'POST', '/auth/resend-confirmation', {
    body: { email: EMAIL },
  })

  await req('logout', 'POST', '/auth/logout', { token })

  // cleanup contact (optional)
  await req('contact-delete', 'DELETE', `/contact/${contactId}`, { token })

  const passed = results.filter((r) => r.ok).length
  const failed = results.filter((r) => !r.ok).length
  const report = {
    email: EMAIL,
    base: BASE,
    passed,
    failed,
    results: results.map((r) => ({
      name: r.name,
      method: r.method,
      path: r.path,
      status: r.status,
      ok: r.ok,
      message: r.message,
      // keep useful snippets only
      snippet:
        r.name.includes('gift-facets') && r.data?.facets
          ? {
              cached: r.data.cached,
              facetCount: r.data.facets.length,
              labels: r.data.facets.map((f) => f.label),
            }
          : r.name.startsWith('wishlist') || r.name.startsWith('contact')
            ? {
                id: r.data?.id,
                purchaseStatus: r.data?.purchaseStatus,
                fullName: r.data?.fullName,
                productName: r.data?.productName,
              }
            : undefined,
    })),
  }

  writeFileSync('/tmp/cc-smoke-report.json', JSON.stringify(report, null, 2))
  console.log('\n=== SUMMARY ===')
  console.log(`passed=${passed} failed=${failed}`)
  console.log('report=/tmp/cc-smoke-report.json')
  if (failed > 0) process.exitCode = 1
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
