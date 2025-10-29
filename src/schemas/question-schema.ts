import { z } from "zod";

export const questionSchema = z.object({
    question: z.string().min(1, 'Question is required'),
    answerKey: z.string().min(1, 'Answer key is required'),
    options: z.array(z.string().min(1, 'Option cannot be empty')).length(3, 'Exactly 3 options required'),
    personalityType: z.string().optional(),
    streamId: z.string().min(1, 'Stream is required'),
    categoryId: z.string().min(1, 'Category is required'),
  })

  export type QuestionSchema = z.infer<typeof questionSchema>;