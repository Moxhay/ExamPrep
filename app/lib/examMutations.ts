import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiExams, apiQuestions } from '@/app/api'
import type { ExamCreatePayload, ExamDetailsPayload, ExamSummary, QuestionPayload } from '@/app/lib/validation'
import { examKeys } from '@/app/lib/examQueries'

export function useCreateExam() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: ExamCreatePayload) => {
      const res = await apiExams.create(payload)
      if (!res.success || !res.data) throw new Error(res.error ?? "Couldn't save the exam. Please try again.")
      return { id: res.data.id, payload }
    },
    onSuccess: ({ id, payload }) => {
      const summary: ExamSummary = { id, title: payload.title, description: payload.description, isPublished: false, questionCount: 0 }
      queryClient.setQueryData<ExamSummary[]>(examKeys.list(), (old) => (old ? [...old, summary] : [summary]))
    },
  })
}

function useUpdateExam(examId: number, fallbackMessage: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: ExamDetailsPayload) => {
      const res = await apiExams.update(examId, payload)
      if (!res.success) throw new Error(res.error ?? fallbackMessage)
      return payload
    },
    onSuccess: (payload) => {
      queryClient.setQueryData(examKeys.detail(examId), (old: unknown) =>
        old && typeof old === 'object' ? { ...old, ...payload } : old
      )
      queryClient.setQueryData<ExamSummary[]>(examKeys.list(), (old) =>
        old?.map((e) => (e.id === examId ? { ...e, title: payload.title, description: payload.description, isPublished: payload.isPublished } : e))
      )
    },
  })
}

export function useUpdateExamDetails(examId: number) {
  return useUpdateExam(examId, "Couldn't save the exam. Please try again.")
}

export function usePublishExam(examId: number) {
  return useUpdateExam(examId, "Couldn't publish the exam. Please try again.")
}

export function useDeleteExam() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (examId: number) => {
      const res = await apiExams.remove(examId)
      if (!res.success) throw new Error(res.error ?? "Couldn't delete the exam.")
      return examId
    },
    onSuccess: (examId) => {
      queryClient.setQueryData<ExamSummary[]>(examKeys.list(), (old) => old?.filter((e) => e.id !== examId))
      queryClient.removeQueries({ queryKey: examKeys.detail(examId) })
    },
  })
}

function invalidateExam(queryClient: ReturnType<typeof useQueryClient>, examId: number, alsoList: boolean) {
  queryClient.invalidateQueries({ queryKey: examKeys.detail(examId) })
  if (alsoList) queryClient.invalidateQueries({ queryKey: examKeys.list() })
}

export function useAddQuestion(examId: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: QuestionPayload) => {
      const res = await apiQuestions.add(examId, payload)
      if (!res.success || !res.data) throw new Error(res.error ?? "Couldn't save the question. Please try again.")
      return res.data
    },
    onSuccess: () => invalidateExam(queryClient, examId, true),
  })
}

export function useUpdateQuestion(examId: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ questionId, payload }: { questionId: number; payload: QuestionPayload }) => {
      const res = await apiQuestions.update(questionId, payload)
      if (!res.success) throw new Error(res.error ?? "Couldn't save the question. Please try again.")
    },
    onSuccess: () => invalidateExam(queryClient, examId, false),
  })
}

export function useDeleteQuestion(examId: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (questionId: number) => {
      const res = await apiQuestions.remove(questionId)
      if (!res.success) throw new Error(res.error ?? "Couldn't delete the question.")
    },
    onSuccess: () => invalidateExam(queryClient, examId, true),
  })
}
