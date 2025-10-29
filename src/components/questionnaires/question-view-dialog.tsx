'use client'

import React from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Question } from '@/types/question'

interface QuestionViewDialogProps {
  question: Question
  open: boolean
  setOpen: (open: boolean) => void
}

export function QuestionViewDialog({ question, open, setOpen }: QuestionViewDialogProps) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Question Details</DialogTitle>
          <DialogDescription>
            View the complete question information
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-sm text-muted-foreground mb-2">Question</h4>
            <p className="text-sm">{question.question}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-sm text-muted-foreground mb-2">Category</h4>
              <Badge variant="secondary">{question.category.name}</Badge>
            </div>
            <div>
              <h4 className="font-medium text-sm text-muted-foreground mb-2">Stream</h4>
              <Badge variant="outline">{question.stream.name}</Badge>
            </div>
          </div>

          <div>
            <h4 className="font-medium text-sm text-muted-foreground mb-2">Correct Answer</h4>
            <p className="text-sm font-medium">{question.answerKey}</p>
          </div>

          <div>
            <h4 className="font-medium text-sm text-muted-foreground mb-2">Options</h4>
            <div className="space-y-2">
              {question.options.map((option, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span className="text-sm font-medium w-6">{index + 1}.</span>
                  <span className="text-sm">{option}</span>
                  {option === question.answerKey && (
                    <Badge variant="default" className="text-xs">Correct</Badge>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
