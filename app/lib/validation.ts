import { z } from 'zod'

export const examCreateSchema = z.object({
  title: z.string().trim().min(1, 'Exam name is required').max(100),
  description: z.string().trim().min(1, 'Description is required').max(200),
})

export type ExamCreatePayload = z.infer<typeof examCreateSchema>

export const examDetailsSchema = examCreateSchema.extend({
  isPublished: z.boolean(),
})

export type ExamDetailsPayload = z.infer<typeof examDetailsSchema>

export const examSummarySchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string().nullable(),
  isPublished: z.boolean(),
  questionCount: z.number(),
})

export type ExamSummary = z.infer<typeof examSummarySchema>

const optionResponseSchema = z.object({
  id: z.number(),
  order: z.number(),
  text: z.string(),
})

const subQuestionResponseSchema = z.object({
  label: z.string(),
  text: z.string().nullable(),
  placeholder: z.string().nullable(),
})

export const questionResponseSchema = z.object({
  id: z.number(),
  number: z.number(),
  type: z.enum(['MultipleChoice', 'Written', 'WrittenMulti', 'FillBlank']),
  title: z.string(),
  text: z.string(),
  context: z.string().nullable(),
  placeholder: z.string().nullable(),
  options: z.array(optionResponseSchema),
  subQuestions: z.array(subQuestionResponseSchema),
})

export type QuestionResponse = z.infer<typeof questionResponseSchema>

export const examDetailSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string().nullable(),
  isPublished: z.boolean(),
  questions: z.array(questionResponseSchema),
})

export type ExamDetail = z.infer<typeof examDetailSchema>

const optionPayloadSchema = z.object({
  text: z.string().trim().min(1, 'Option text is required'),
})

const subQuestionPayloadSchema = z.object({
  label: z.string().trim().min(1, 'Sub-question label is required').max(10),
  text: z.string().max(500).optional(),
  placeholder: z.string().max(200).optional(),
})

const baseQuestionFields = {
  title: z.string().trim().min(1, 'Title is required'),
  text: z.string().trim().min(1, 'Question text is required'),
  context: z.string().optional(),
}

export const multipleChoiceQuestionSchema = z.object({
  ...baseQuestionFields,
  type: z.literal('multiple_choice'),
  options: z.array(optionPayloadSchema).min(2, 'Add at least 2 options'),
})

export const fillBlankQuestionSchema = z.object({
  ...baseQuestionFields,
  type: z.literal('fill_blank'),
})

export const writtenQuestionSchema = z.object({
  ...baseQuestionFields,
  type: z.literal('written'),
  placeholder: z.string().max(200).optional(),
})

export const writtenMultiQuestionSchema = z.object({
  ...baseQuestionFields,
  type: z.literal('written_multi'),
  subQuestions: z.array(subQuestionPayloadSchema).min(1, 'Add at least one sub-question'),
})

export const questionSchema = z.discriminatedUnion('type', [
  multipleChoiceQuestionSchema,
  fillBlankQuestionSchema,
  writtenQuestionSchema,
  writtenMultiQuestionSchema,
])

export type QuestionPayload = z.infer<typeof questionSchema>

export type WizardQuestion = QuestionPayload & { id: number; number: number }
