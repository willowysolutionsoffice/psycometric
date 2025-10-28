'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Plus, Edit, Trash2, Calendar } from 'lucide-react'
import { toast } from 'sonner'

interface Category {
  id: string
  name: string
}

interface Stream {
  id: string
  name: string
  createdAt: string
  updatedAt: string
}

interface Question {
  id: string
  question: string
  answerKey: string
  options: string[]
  streamId: string
  stream: Stream
  categoryId: string
  category: Category
  createdAt: string
  updatedAt: string
}

export default function QuestionariesPage() {
  const [questions, setQuestions] = useState<Question[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [streams, setStreams] = useState<Stream[]>([])
  const [loading, setLoading] = useState(true)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null)
  const [viewingQuestion, setViewingQuestion] = useState<Question | null>(null)
  const [formData, setFormData] = useState({
    question: '',
    answerKey: '',
    options: ['', '', ''],
    streamId: '',
    categoryId: ''
  })

  // Fetch questions and categories
  const fetchQuestions = async () => {
    try {
      const response = await fetch('/api/questions')
      if (response.ok) {
        const data = await response.json()
        setQuestions(data)
      } else {
        toast.error('Failed to fetch questions')
      }
    } catch {
      toast.error('Error fetching questions')
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories')
      if (response.ok) {
        const data = await response.json()
        setCategories(data)
      }
    } catch {
      toast.error('Error fetching categories')
    }
  }

  const fetchStreams = async () => {
    try {
      const response = await fetch('/api/streams')
      if (response.ok) {
        const data = await response.json()
        setStreams(data)
      }
    } catch {
      toast.error('Error fetching streams')
    }
  }

  useEffect(() => {
    fetchQuestions()
    fetchCategories()
    fetchStreams()
  }, [])

  // Create question
  const handleCreateQuestion = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast.success('Question created successfully')
        setIsCreateDialogOpen(false)
        resetForm()
        fetchQuestions()
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to create question')
      }
    } catch {
      toast.error('Error creating question')
    }
  }

  // Update question
  const handleUpdateQuestion = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingQuestion) return

    try {
      const response = await fetch(`/api/questions/${editingQuestion.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast.success('Question updated successfully')
        setIsEditDialogOpen(false)
        setEditingQuestion(null)
        resetForm()
        fetchQuestions()
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to update question')
      }
    } catch {
      toast.error('Error updating question')
    }
  }

  // Delete question
  const handleDeleteQuestion = async (questionId: string) => {
    try {
      const response = await fetch(`/api/questions/${questionId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast.success('Question deleted successfully')
        fetchQuestions()
      } else {
        toast.error('Failed to delete question')
      }
    } catch {
      toast.error('Error deleting question')
    }
  }

  // Open edit dialog
  const openEditDialog = (question: Question) => {
    setEditingQuestion(question)
    setFormData({
      question: question.question,
      answerKey: question.answerKey,
      options: question.options,
      streamId: question.streamId,
      categoryId: question.categoryId
    })
    setIsEditDialogOpen(true)
  }

  // Open detail dialog
  const openDetailDialog = (question: Question) => {
    setViewingQuestion(question)
    setIsDetailDialogOpen(true)
  }

  // Reset form
  const resetForm = () => {
    setFormData({
      question: '',
      answerKey: '',
      options: ['', '', ''],
      streamId: '',
      categoryId: ''
    })
    setEditingQuestion(null)
  }

  // Update option
  const updateOption = (index: number, value: string) => {
    const newOptions = [...formData.options]
    newOptions[index] = value
    setFormData({
      ...formData,
      options: newOptions
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
          <p className="mt-4 text-gray-600">Loading questions...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Questions</h1>
          <p className="text-gray-600">Manage your psychometric questions</p>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="w-4 h-4 mr-2" />
              Add New Question
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Question</DialogTitle>
              <DialogDescription>
                Add a new psychometric question with options and answer key.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateQuestion}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="question">Question *</Label>
                  <Textarea
                    id="question"
                    value={formData.question}
                    onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                    placeholder="Enter the question"
                    rows={3}
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="stream">Stream *</Label>
                    <Select value={formData.streamId} onValueChange={(value) => setFormData({ ...formData, streamId: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select stream" />
                      </SelectTrigger>
                      <SelectContent>
                        {streams.map((stream) => (
                          <SelectItem key={stream.id} value={stream.id}>
                            {stream.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="category">Category *</Label>
                    <Select value={formData.categoryId} onValueChange={(value) => setFormData({ ...formData, categoryId: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label>Options * (3 required)</Label>
                  {formData.options.map((option, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={option}
                        onChange={(e) => updateOption(index, e.target.value)}
                        placeholder={`Option ${index + 1}`}
                        required
                      />
                    </div>
                  ))}
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="answerKey">Answer Key *</Label>
                  <Input
                    id="answerKey"
                    value={formData.answerKey}
                    onChange={(e) => setFormData({ ...formData, answerKey: e.target.value })}
                    placeholder="Enter the correct answer"
                    required
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Create Question</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {questions.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">No questions found</h3>
              <p className="text-gray-600 mb-4">Get started by creating your first question.</p>
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Create Question
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Questions</CardTitle>
            <CardDescription>Manage your psychometric questions</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Question</TableHead>
                  <TableHead>Stream</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Answer Key</TableHead>
                  <TableHead>Options</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {questions.map((question) => (
                  <TableRow key={question.id} className="cursor-pointer hover:bg-muted/50" onClick={() => openDetailDialog(question)}>
                    <TableCell className="max-w-xs">
                      <div className="truncate" title={question.question}>
                        {question.question}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {question.stream.name}
                      </span>
                    </TableCell>
                    <TableCell>{question.category.name}</TableCell>
                    <TableCell className="font-medium">{question.answerKey}</TableCell>
                    <TableCell>
                      <div className="text-sm text-gray-600">
                        {question.options.length} options
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(question.createdAt).toLocaleDateString()}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditDialog(question)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the question.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteQuestion(question.id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Question</DialogTitle>
            <DialogDescription>
              Update the question information.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdateQuestion}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-question">Question *</Label>
                <Textarea
                  id="edit-question"
                  value={formData.question}
                  onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                  placeholder="Enter the question"
                  rows={3}
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-stream">Stream *</Label>
                  <Select value={formData.streamId} onValueChange={(value) => setFormData({ ...formData, streamId: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select stream" />
                    </SelectTrigger>
                    <SelectContent>
                      {streams.map((stream) => (
                        <SelectItem key={stream.id} value={stream.id}>
                          {stream.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="edit-category">Category *</Label>
                  <Select value={formData.categoryId} onValueChange={(value) => setFormData({ ...formData, categoryId: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-2">
                <Label>Options * (3 required)</Label>
                {formData.options.map((option, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={option}
                      onChange={(e) => updateOption(index, e.target.value)}
                      placeholder={`Option ${index + 1}`}
                      required
                    />
                  </div>
                ))}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="edit-answerKey">Answer Key *</Label>
                <Input
                  id="edit-answerKey"
                  value={formData.answerKey}
                  onChange={(e) => setFormData({ ...formData, answerKey: e.target.value })}
                  placeholder="Enter the correct answer"
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Update Question</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Detail Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Question Details</DialogTitle>
            <DialogDescription>
              View complete question information
            </DialogDescription>
          </DialogHeader>
          {viewingQuestion && (
            <div className="space-y-6">
              <div>
                <Label className="text-sm font-medium text-gray-500">Question</Label>
                <p className="mt-1 text-base">{viewingQuestion.question}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-500">Stream</Label>
                  <div className="mt-1">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {STREAM_OPTIONS.find(s => s.value === viewingQuestion.stream)?.label}
                    </span>
                  </div>
                </div>
                
                <div>
                  <Label className="text-sm font-medium text-gray-500">Category</Label>
                  <p className="mt-1 text-base">{viewingQuestion.category.name}</p>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-500">Answer Key</Label>
                <p className="mt-1 text-base font-medium text-green-600">{viewingQuestion.answerKey}</p>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-500">Options</Label>
                <div className="mt-2 space-y-2">
                  {viewingQuestion.options.map((option, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                      <span className="flex-shrink-0 w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-sm font-medium">
                        {String.fromCharCode(65 + index)}
                      </span>
                      <span className="flex-1">{option}</span>
                      {option === viewingQuestion.answerKey && (
                        <span className="flex-shrink-0 px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">
                          Correct Answer
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div>
                  <Label className="text-sm font-medium text-gray-500">Created At</Label>
                  <p className="mt-1 text-sm text-gray-600">
                    {new Date(viewingQuestion.createdAt).toLocaleString()}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Updated At</Label>
                  <p className="mt-1 text-sm text-gray-600">
                    {new Date(viewingQuestion.updatedAt).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDetailDialogOpen(false)}>
              Close
            </Button>
            {viewingQuestion && (
              <Button onClick={() => {
                setIsDetailDialogOpen(false)
                openEditDialog(viewingQuestion)
              }}>
                <Edit className="w-4 h-4 mr-2" />
                Edit Question
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}