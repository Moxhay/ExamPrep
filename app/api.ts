import type {
  ExamCreatePayload,
  ExamDetailsPayload,
  ExamSummary,
  ExamDetail,
  QuestionResponse,
  QuestionPayload,
} from '@/app/lib/validation'

type InternalQuestionType = QuestionPayload['type']

const QUESTION_TYPE_TO_BACKEND: Record<InternalQuestionType, string> = {
  multiple_choice: 'MultipleChoice',
  written: 'Written',
  written_multi: 'WrittenMulti',
  fill_blank: 'FillBlank',
}

const QUESTION_TYPE_FROM_BACKEND: Record<string, InternalQuestionType> = {
  MultipleChoice: 'multiple_choice',
  Written: 'written',
  WrittenMulti: 'written_multi',
  FillBlank: 'fill_blank',
}

function toBackendQuestion(payload: QuestionPayload) {
  return { ...payload, type: QUESTION_TYPE_TO_BACKEND[payload.type] }
}

export type InternalQuestionResponse = Omit<QuestionResponse, 'type'> & { type: InternalQuestionType }

function fromBackendQuestion(question: QuestionResponse): InternalQuestionResponse {
  return { ...question, type: QUESTION_TYPE_FROM_BACKEND[question.type] ?? question.type } as InternalQuestionResponse
}

export type ExamDetailInternal = Omit<ExamDetail, 'questions'> & {
  questions: InternalQuestionResponse[]
}

export interface ApiResponse<T = unknown> {
  success: boolean
  error: string | null
  data: T | null
}

export interface CacheConfig {
  cache?: boolean
  revalidate?: number
}

export interface RequestConfig {
  url: string
  params?: Record<string, string | number | undefined>
  payload?: unknown
  cacheConfig?: CacheConfig
  headers?: HeadersInit
}

if (!process.env.NEXT_PUBLIC_API_BASE_URL) throw new Error('NEXT_PUBLIC_API_BASE_URL is not set')
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

const HEADERS: HeadersInit = { 'Content-Type': 'application/json' }

function buildUrl(url: string, params?: RequestConfig['params']): string {
  const fullUrl = `${BASE_URL}${url}`
  if (!params) return fullUrl

  const searchParams = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) searchParams.append(key, String(value))
  })

  const queryString = searchParams.toString()
  return queryString ? `${fullUrl}?${queryString}` : fullUrl
}

async function parseBody(res: Response): Promise<unknown> {
  const text = await res.text()
  return text ? JSON.parse(text) : null
}

async function request<T>(
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  { url, params, payload, cacheConfig, headers }: RequestConfig
): Promise<ApiResponse<T>> {
  try {
    const fetchOptions: RequestInit & { next?: { revalidate: number } } = {
      method,
      headers: { ...HEADERS, ...headers },
      credentials: 'include',
    }

    if (payload !== undefined) fetchOptions.body = JSON.stringify(payload)

    if (method === 'GET') {
      if (cacheConfig?.cache === false) fetchOptions.cache = 'no-store'
      else if (cacheConfig?.revalidate !== undefined) fetchOptions.next = { revalidate: cacheConfig.revalidate }
    }

    const response = await fetch(buildUrl(url, params), fetchOptions)
    const data = await parseBody(response)

    if (!response.ok) {
      const errorMessage = (data as { error?: string } | null)?.error || response.statusText
      return { success: false, error: errorMessage, data: null }
    }

    return { success: true, error: null, data: data as T }
  } catch (error) {
    return { success: false, error: (error as Error).message, data: null }
  }
}

const apiGet = <T>(config: RequestConfig) => request<T>('GET', config)
const apiPost = <T>(config: RequestConfig) => request<T>('POST', config)
const apiPut = <T>(config: RequestConfig) => request<T>('PUT', config)
const apiDelete = <T>(config: RequestConfig) => request<T>('DELETE', config)

export interface LoginPayload {
  email: string
  password: string
}

export const apiAuth = {
  login: (payload: LoginPayload) => apiPost({ url: '/auth/login', payload }),

  logout: () => apiPost({ url: '/auth/logout' }),

  me: (headers?: HeadersInit) => apiGet({ url: '/auth/me', cacheConfig: { cache: false }, headers }),
}

export const apiExams = {
  getAll: (cacheConfig?: CacheConfig, headers?: HeadersInit) => apiGet<ExamSummary[]>({ url: '/exams', cacheConfig, headers }),

  getById: async (id: number, cacheConfig?: CacheConfig, headers?: HeadersInit): Promise<ApiResponse<ExamDetailInternal>> => {
    const res = await apiGet<ExamDetail>({ url: `/exams/${id}`, cacheConfig, headers })
    if (!res.data) return { success: res.success, error: res.error, data: null }
    return { ...res, data: { ...res.data, questions: res.data.questions.map(fromBackendQuestion) } }
  },

  create: (payload: ExamCreatePayload) => apiPost<{ id: number }>({ url: '/exams', payload }),

  update: (id: number, payload: ExamDetailsPayload) => apiPut<null>({ url: `/exams/${id}`, payload }),

  remove: (id: number) => apiDelete<null>({ url: `/exams/${id}` }),
}

export const apiQuestions = {
  add: (examId: number, payload: QuestionPayload) =>
    apiPost<{ id: number }>({ url: `/exams/${examId}/questions`, payload: toBackendQuestion(payload) }),

  update: (questionId: number, payload: QuestionPayload) =>
    apiPut<null>({ url: `/questions/${questionId}`, payload: toBackendQuestion(payload) }),

  remove: (questionId: number) => apiDelete<null>({ url: `/questions/${questionId}` }),
}
