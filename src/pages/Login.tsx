import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { kyClient, strip } from '@/lib/api'
import { useAuthStore } from '@/store'
import { toast } from 'sonner'
import type { ApiResponse } from '@/lib/api'

interface LoginPayload {
  access: string
  refresh: string
  user: { id: string; email: string; name: string }
}

export function Login() {
  const { setAuth } = useAuthStore()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) return
    setLoading(true)
    try {
      const res = await kyClient.post(strip('auth/login/'), { json: { email, password } }).json<ApiResponse<LoginPayload>>()
      setAuth(res.data.access, res.data.user)
      navigate('/', { replace: true })
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-dvh items-center justify-center bg-stone-50 p-4 dark:bg-zinc-950">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mb-3 text-4xl">◰</div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Arihant Mobile</h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">Sign in to your store</p>
        </div>
        <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="admin@arihant.local"
                autoComplete="email"
                required
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="mt-1 flex w-full items-center justify-center rounded-lg bg-zinc-900 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-zinc-700 disabled:opacity-60 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300">
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
        </div>
        <p className="mt-4 text-center text-xs text-zinc-400">
          Default: admin@arihant.local / admin123
        </p>
      </div>
    </div>
  )
}
