'use client'
import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { api } from '@/lib/api'

function AuthForm() {
  const router  = useRouter()
  const params  = useSearchParams()
  const [mode, setMode]     = useState(params.get('mode')==='signup'?'signup':'login')
  const [email, setEmail]   = useState('')
  const [pw, setPw]         = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError]   = useState('')

  async function submit(e) {
    e.preventDefault(); setError(''); setLoading(true)
    try {
      const data = mode==='signup' ? await api.signup(email,pw) : await api.login(email,pw)
      localStorage.setItem('aiwpb_token', data.session.access_token)
      localStorage.setItem('aiwpb_user', JSON.stringify(data.user))
      const next = params.get('next') || '/dashboard'
      router.push(next)
    } catch(err) { setError(err.message) }
    finally { setLoading(false) }
  }

  async function oauth(provider) {
    setLoading(true)
    try { const d = await api.oauthUrl(provider); window.location.href = d.url }
    catch(err) { setError(err.message); setLoading(false) }
  }

  return (
    <div className="min-h-screen mesh-bg flex flex-col items-center justify-center px-4">
      <Link href="/" className="flex items-center gap-2 font-semibold text-zinc-900 text-lg mb-8">
        <div style={{width:32,height:32,borderRadius:9,background:'linear-gradient(135deg,#5271ff,#a855f7)',display:'flex',alignItems:'center',justifyContent:'center'}}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
        </div>
        AI WP Builder
      </Link>

      <div className="bg-white rounded-2xl shadow-xl border border-zinc-100 w-full max-w-sm p-8">
        <h2 className="text-xl font-semibold text-zinc-900 mb-1">
          {mode==='login'?'Welcome back':'Create your account'}
        </h2>
        <p className="text-sm text-zinc-500 mb-6">
          {mode==='login'?'Sign in to continue building.':'100 free credits when you sign up.'}
        </p>

        <div className="flex flex-col gap-2 mb-5">
          <button onClick={()=>oauth('google')} disabled={loading} className="flex items-center justify-center gap-2 w-full border border-zinc-200 rounded-xl py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50 transition-colors disabled:opacity-50">
            <svg width="16" height="16" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
            Continue with Google
          </button>
          <button onClick={()=>oauth('github')} disabled={loading} className="flex items-center justify-center gap-2 w-full border border-zinc-200 rounded-xl py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50 transition-colors disabled:opacity-50">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>
            Continue with GitHub
          </button>
        </div>

        <div className="flex items-center gap-3 mb-5">
          <div className="flex-1 h-px bg-zinc-100"/><span className="text-xs text-zinc-400">or</span><div className="flex-1 h-px bg-zinc-100"/>
        </div>

        <form onSubmit={submit} className="flex flex-col gap-3">
          <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email address" required className="w-full border border-zinc-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 transition-all"/>
          <div className="relative">
            <input type={showPw?'text':'password'} value={pw} onChange={e=>setPw(e.target.value)} placeholder="Password (min 8 chars)" required minLength={8} className="w-full border border-zinc-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 transition-all pr-10"/>
            <button type="button" onClick={()=>setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 text-xs">{showPw?'Hide':'Show'}</button>
          </div>
          {error && <div className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">{error}</div>}
          <button type="submit" disabled={loading||!email||!pw} className="w-full bg-zinc-900 hover:bg-zinc-700 disabled:bg-zinc-200 disabled:text-zinc-400 text-white font-medium py-2.5 rounded-xl text-sm transition-colors mt-1">
            {loading ? 'Please wait...' : mode==='login' ? 'Sign in' : 'Create account — free'}
          </button>
        </form>

        <p className="text-center text-xs text-zinc-400 mt-5">
          {mode==='login'?"Don't have an account? ":"Already have an account? "}
          <button onClick={()=>{setMode(mode==='login'?'signup':'login');setError('')}} className="text-blue-600 hover:underline font-medium">
            {mode==='login'?'Sign up free':'Sign in'}
          </button>
        </p>
      </div>
    </div>
  )
}

export default function AuthPage() {
  return <Suspense><AuthForm /></Suspense>
}
