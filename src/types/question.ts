export interface Category {
  id: string
  name: string
  createdAt: Date
  updatedAt: Date
}

export interface Stream {
  id: string
  name: string
  createdAt: Date
  updatedAt: Date
}

export interface Question {
  id: string
  question: string
  answerKey: string
  options: string[]
  personalityType?: string | null
  streamId: string
  stream: Stream
  categoryId: string
  category: Category
  createdAt: Date
  updatedAt: Date
}
