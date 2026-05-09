import ky, { isHTTPError } from 'ky'
import type { BeforeRequestState, AfterResponseState, BeforeErrorState } from 'ky'
import { useAuthStore } from '@/store'

const BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:8000/api'

type Params = Record<string, string | string[] | undefined>

function buildSearch(params?: Params): URLSearchParams {
  const sp = new URLSearchParams()
  if (!params) return sp
  for (const [k, v] of Object.entries(params)) {
    if (v === undefined || v === '' || v === 'all') continue
    if (Array.isArray(v)) v.forEach(val => sp.append(k, val))
    else sp.set(k, v)
  }
  return sp
}

const kyClient = ky.create({
  prefix: BASE,
  hooks: {
    beforeRequest: [
      ({ request }: BeforeRequestState) => {
        const token = useAuthStore.getState().token
        if (token) request.headers.set('Authorization', `Bearer ${token}`)
      },
    ],
    afterResponse: [
      ({ response }: AfterResponseState) => {
        if (response.status === 401) useAuthStore.getState().clearAuth()
      },
    ],
    beforeError: [
      async ({ error }: BeforeErrorState): Promise<Error> => {
        if (isHTTPError(error)) {
          try {
            const body = await error.response.clone().json() as { error?: string }
            if (body?.error) error.message = body.error
          } catch { /* ignore */ }
        }
        return error
      },
    ],
  },
})

export const strip = (path: string) => path.replace(/^\/+/, '')
export { buildSearch }

export type ApiResponse<T> = { ok: true; data: T }
export type ApiPaginated<T> = { ok: true; data: T[]; meta: { total: number; page: number; page_size: number } }
export type ApiError = { error: string }

export { kyClient }
