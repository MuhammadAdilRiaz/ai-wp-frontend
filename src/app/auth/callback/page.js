'use client'
import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { api } from '@/lib/api'

function CallbackHandler() {
  const router = useRouter()
  const params = useSearchParams()
  const [error, setError] = useState('')

  useEffect(() => {
    const code = params.get('code')

    if (!code) {
      setError('No authorization code received.')
      setTimeout(() => router.push('/auth'), 1500)
      return
    }

    api.oauthCallback(code)
      .then(data => {
        localStorage.setItem('aiwpb_token', data.session.access_token)
        localStorage.setItem('aiwpb_user', JSON.stringify(data.user))
        router.push('/dashboard')
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