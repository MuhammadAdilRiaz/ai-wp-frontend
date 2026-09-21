'use client'
import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { api } from '@/lib/api'
import { startNewSession } from '@/lib/auth'

function CallbackHandler() {
  const router = useRouter()
  const params = useSearchParams()
  const [error, setError] = useState('')

  useEffect(() => {
    const code  = params.get('code')
    // The backend put this on the redirect URL and keyed the PKCE verifier by
    // it; sending it back is what keeps two simultaneous logins apart.
    const state = params.get('state')

    if (!code) {
      setError('No authorization code received.')
      setTimeout(() => router.push('/auth'), 1500)
      return
    }

    api.oauthCallback(code, state)
      .then(data => {
        startNewSession(data.session, data.user, data.session_max_age_days)
        router.replace('/dashboard')
      })
      .catch(err => {
        setError(err.message || 'Login failed. Please try again.')
        setTimeout(() => router.push('/auth'), 1500)
      })
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center text-sm text-zinc-500">
      {error ? `${error} Redirecting...` : 'Signing you in…'}
    </div>
  )
}

export default function CallbackPage() {
  return (
    <Suspense>
      <CallbackHandler />
    </Suspense>
  )
}