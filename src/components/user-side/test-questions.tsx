"use client"

import React, { useState, useEffect } from 'react';
import { User} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Question } from '@/types/question';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

// Shuffle array function using Fisher-Yates algorithm
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Transform database question to display format with shuffled options
interface DisplayQuestion {
  id: string;
  question: string;
  options: { id: string; text: string }[];
  correctAnswer: string;
  explanation?: string;
  personalityType?: string | null;
}

function transformQuestion(dbQuestion: Question): DisplayQuestion {
  // Remove answerKey from options if it exists there (to avoid duplicates)
  // Then combine wrong answers with correct answer
  const wrongOptions = dbQuestion.options.filter(opt => opt !== dbQuestion.answerKey);
  
  // Combine wrong options with correct answer
  const allOptions = [...wrongOptions, dbQuestion.answerKey];
  
  // Ensure we have exactly 4 options
  // If we have more than 4, take only the first 4
  // If we have fewer than 4 (shouldn't happen with proper data), use what we have
  const finalOptions = allOptions.slice(0, 4);
  
  // Create options array with labels (A, B, C, D)
  const optionLabels = ['A', 'B', 'C', 'D'];
  const correctAnswerText = dbQuestion.answerKey;
  
  const optionsWithLabels = finalOptions.map((text, index) => ({
    id: optionLabels[index],
    text: text
  }));

  // Shuffle the options
  const shuffledOptions = shuffleArray(optionsWithLabels);

  // Find the new position of the correct answer after shuffling
  const newCorrectAnswer = shuffledOptions.find(
    opt => opt.text === correctAnswerText
  )?.id || 'A';

  return {
    id: dbQuestion.id,
    question: dbQuestion.question,
    options: shuffledOptions,
    correctAnswer: newCorrectAnswer,
    personalityType: dbQuestion.personalityType ?? null,
  };
}

// interface AnswerResult {
//   questionId: string;
//   personalityType: string | null;
//   isCorrect: boolean;
// }

export default function TestQuestions() {
  const router = useRouter();
  const [questions, setQuestions] = useState<DisplayQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  // We no longer show correctness feedback; submission step removed
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [completedQuestions, setCompletedQuestions] = useState(0);
  // const [answerResults, setAnswerResults] = useState<AnswerResult[]>([]);
 // Timer setup: start from 15 minutes (900 seconds)
  const [timer, setTimer] = useState(900); // ✅ 15 * 60 = 900 seconds
  const [score, setScore] = useState(0);
  const [userId, setUserId] = useState<string | null>(null);
  const [correctByType, setCorrectByType] = useState<Record<string, number>>({});
  const [totalByType, setTotalByType] = useState<Record<string, number>>({});
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  // Removed auto restore modal; only show modal on back/navigation
  // No need to track pending href; restart always navigates home

  // On mount, read user and prevent re-attempt if result exists
  useEffect(() => {
    try {
      const raw = typeof window !== 'undefined' ? localStorage.getItem('authUser') : null;
      if (!raw) {
        router.push('/login');
        return;
      }
      if (raw) {
        const user = JSON.parse(raw) as { id?: string };
        if (user?.id) {
          setUserId(user.id);
          fetch(`/api/results?userId=${user.id}`)
            .then(res => res.json())
            .then(data => {
              if (data?.exists) {
                router.push('/interest-result');
              }
            })
            .catch(() => {});
        }
      }
    } catch {}
  }, [router]);

  // Fetch questions from database
  useEffect(() => {
    async function fetchQuestions() {
      try {
        const response = await fetch('/api/questions');
        if (!response.ok) {
          throw new Error('Failed to fetch questions');
        }
        const data: Question[] = await response.json();
        
        // Remove duplicates based on question ID (most reliable)
        const uniqueQuestionsById = new Map<string, Question>();
        data.forEach(question => {
          if (!uniqueQuestionsById.has(question.id)) {
            uniqueQuestionsById.set(question.id, question);
          }
        });
        
        // Also remove duplicates based on question text (in case same question exists with different IDs)
        const uniqueQuestionsByText = new Map<string, Question>();
        uniqueQuestionsById.forEach(question => {
          const normalizedText = question.question.trim().toLowerCase();
          if (!uniqueQuestionsByText.has(normalizedText)) {
            uniqueQuestionsByText.set(normalizedText, question);
          }
        });
        
        // Convert map back to array
        const uniqueQuestions = Array.from(uniqueQuestionsByText.values());
        
        // Define personality types
        const personalityTypes = [
          'Realistic',
          'Investigative',
          'Artistic',
          'Social',
          'Enterprising',
          'Conventional'
        ];
        
        // Group questions by personality type
        const questionsByType = new Map<string, Question[]>();
        personalityTypes.forEach(type => {
          questionsByType.set(type, []);
        });
        
        uniqueQuestions.forEach(question => {
          const type = question.personalityType?.trim();
          if (type && questionsByType.has(type)) {
            questionsByType.get(type)!.push(question);
          }
        });
        
        // Select 3 questions from each personality type
        const selectedQuestions: Question[] = [];
        const usedQuestionIds = new Set<string>();
        
        personalityTypes.forEach(type => {
          const typeQuestions = shuffleArray(questionsByType.get(type) || []);
          const questionsToAdd = typeQuestions.filter(q => !usedQuestionIds.has(q.id)).slice(0, 3);
          questionsToAdd.forEach(q => {
            selectedQuestions.push(q);
            usedQuestionIds.add(q.id);
          });
        });
        
        // Calculate how many more questions we need
        const questionsNeeded = 20 - selectedQuestions.length;
        
        // Get remaining questions (not yet selected)
        const remainingQuestions = uniqueQuestions.filter(q => !usedQuestionIds.has(q.id));
        const shuffledRemaining = shuffleArray(remainingQuestions);
        
        // Add remaining questions randomly to reach 20
        const additionalQuestions = shuffledRemaining.slice(0, questionsNeeded);
        selectedQuestions.push(...additionalQuestions);
        
        // Transform questions
        const transformedQuestions = selectedQuestions.map(transformQuestion);
        
        // Shuffle the final array to randomize order
        const shuffledQuestions = shuffleArray(transformedQuestions);
        
        setQuestions(shuffledQuestions);
        // derive totals per personality type for scaling results later
        const totals: Record<string, number> = {};
        shuffledQuestions.forEach(q => {
          const t = (q.personalityType || '').trim();
          if (!t) return;
          totals[t] = (totals[t] || 0) + 1;
        });
        setTotalByType(totals);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching questions:', error);
        setLoading(false);
      }
    }

    fetchQuestions();
  }, []);

  // Mark test as in-progress (no restore modal on mount)
  useEffect(() => {
    try {
      sessionStorage.setItem('testInProgress', 'true');
    } catch {}
  }, []);

  // Intercept page reload/close with native confirm dialog
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, []);

  // Prevent back navigation and show modal
  useEffect(() => {
    // Push a state so that back triggers popstate we can neutralize
    const push = () => {
      try { history.pushState(null, '', location.href); } catch {}
    };
    push();
    const onPopState = () => {
      // Neutralize back and show modal
      push();
      setShowLeaveModal(true);
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  // Intercept same-tab anchor navigations to show modal
  useEffect(() => {
    const clickHandler = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const anchor = target.closest('a') as HTMLAnchorElement | null;
      if (!anchor) return;
      // Ignore new tabs, downloads, external, modifiers
      if (anchor.target === '_blank' || anchor.download) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const href = anchor.getAttribute('href') || '';
      if (!href || href.startsWith('#')) return;
      // Prevent default and show modal
      e.preventDefault();
      setShowLeaveModal(true);
    };
    document.addEventListener('click', clickHandler, true);
    return () => document.removeEventListener('click', clickHandler, true);
  }, []);

  const confirmLeave = () => {
    try { sessionStorage.removeItem('testInProgress'); } catch {}
    router.push('/'); // Go to homepage instead of reload
  };

  const cancelLeave = () => {
    setShowLeaveModal(false);
  };

// Countdown effect
useEffect(() => {
    if (timer <= 0 || loading || questions.length === 0) return; // stop when timer reaches 0 or no questions
  const interval = setInterval(() => {
    setTimer((prev) => prev - 1);
  }, 1000);

  return () => clearInterval(interval);
  }, [timer, loading, questions.length]);

// Format timer (MM:SS)
const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

  const handleAnswerSelect = (answerId: string) => {
    if (!isSubmitted) {
      setSelectedAnswer(answerId);
    }
  };

  const handleNext = async () => {
    if (!selectedAnswer) return;
    // Increment progress and score silently (no feedback UI)
    setCompletedQuestions(completedQuestions + 1);
    if (selectedAnswer === questions[currentQuestion].correctAnswer) {
      setScore(prev => prev + 1);
      const t = (questions[currentQuestion].personalityType || '').trim();
      if (t) {
        setCorrectByType(prev => ({ ...prev, [t]: (prev[t] || 0) + 1 }));
      }
    }
    // If this is the last question (question 20), redirect to interest result page
    if (currentQuestion >= 19) {
      // Submit final result before redirect
      const uid = userId;
      if (uid) {
        try {
          await fetch('/api/results', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              userId: uid, 
              score,
              details: { byType: correctByType, totals: totalByType }
            }),
          });
          // If already exists (409), proceed anyway
        } catch {}
      }
      router.push('/interest-result');
      return;
    }
    
    // Move to next question
    setCurrentQuestion(currentQuestion + 1);
    setSelectedAnswer(null);
    setIsSubmitted(false);
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-orange-600 font-semibold">Loading questions...</p>
        </div>
      </div>
    );
  }

  // No questions state
  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-orange-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-orange-600 font-semibold text-xl">No questions available</p>
          <p className="text-gray-600 mt-2">Please check back later.</p>
        </div>
      </div>
    );
  }

  // correctness is computed internally on next; no UI feedback
  const totalQuestions = 20; // Fixed limit of 20 questions
  const progressPercentage = (completedQuestions / totalQuestions) * 100;

  return (
    <div className="min-h-screen bg-orange-50">
      {/* Leave/Restart Modal (on back/navigate away) */}
      <Dialog open={showLeaveModal} onOpenChange={setShowLeaveModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Leave test?</DialogTitle>
            <DialogDescription>
              Your current test progress will not be saved. The test will restart from the first question.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-end">
            <Button variant="outline" onClick={cancelLeave}>Stay</Button>
            <Button variant="destructive" onClick={confirmLeave}>Restart Test</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* No restore modal on mount */}
      {/* Top Header Bar */}
      <div className="bg-orange-50 px-4 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-end">

          {/* Right side icons */}
          <div className="flex items-center gap-4">
            {/* Progress Circle */}
            <div className="relative w-14 h-14">
              {/* Background circle */}
              <svg className="w-14 h-14 transform -rotate-90">
                <circle
                  cx="28"
                  cy="28"
                  r="24"
                  stroke="#e5e7eb"
                  strokeWidth="4"
                  fill="white"
                />
                {/* Progress circle */}
                <circle
                  cx="28"
                  cy="28"
                  r="24"
                  stroke="#fb923c"
                  strokeWidth="4"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 24}`}
                  strokeDashoffset={`${2 * Math.PI * 24 * (1 - progressPercentage / 100)}`}
                  strokeLinecap="round"
                  className="transition-all duration-500"
                />
              </svg>
              {/* User Icon in center */}
              <div className="absolute inset-0 flex items-center justify-center">
                <User className="w-6 h-6 text-orange-500" />
              </div>
              {/* Notification badge */}
              {completedQuestions > 0 && (
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center">
                  <span className="text-xs text-white font-bold">{completedQuestions}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 pb-8">
      <div className="max-w-5xl mx-auto">
        {/* Orange Header with Airplanes */}
        <div className="relative bg-orange-500 rounded-t-3xl p-8 overflow-hidden">
          {/* Decorative circles and airplanes */}
          <div className="absolute top-4 left-20 w-16 h-16 border-4 border-orange-400 border-dashed rounded-full opacity-60"></div>
          <div className="absolute top-4 right-20 w-16 h-16 border-4 border-orange-400 border-dashed rounded-full opacity-60"></div>
          
          {/* Airplane icons */}
          <div className="absolute top-12 left-32">
            <svg className="w-12 h-12 text-orange-400 transform -rotate-45" fill="currentColor" viewBox="0 0 24 24">
              <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
            </svg>
          </div>
          <div className="absolute top-8 left-1/2">
            <svg className="w-10 h-10 text-orange-400 transform rotate-12" fill="currentColor" viewBox="0 0 24 24">
              <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
            </svg>
          </div>
          <div className="absolute top-16 right-32">
            <svg className="w-12 h-12 text-orange-400 transform rotate-45" fill="currentColor" viewBox="0 0 24 24">
              <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
            </svg>
          </div>

            {/* Question Counter and Timer */}
            <div className="relative text-center space-y-3">
            <div className="inline-block bg-white px-6 py-2 rounded-full shadow-md">
              <span className="text-orange-500 font-semibold">
                Question {currentQuestion + 1}/20
              </span>
            </div>
              <div className="text-white text-sm font-medium">
                Time: {formatTime(timer)}
              </div>
          </div>
        </div>

        {/* White Content Area */}
        <div className="bg-white rounded-b-3xl shadow-xl p-8 md:p-12">
          {/* Question */}
          <div className="mb-12">
            <p className="text-xl md:text-2xl text-gray-800 text-center font-medium">
              {questions[currentQuestion].question}
            </p>
          </div>

          {/* Options */}
            <div className="grid md:grid-cols-2 gap-4 mb-8">
              {questions[currentQuestion].options.map((option, index) => {
              const isSelected = selectedAnswer === option.id;
                // No correctness visuals
              
              let borderColor = 'border-gray-300';
              let bgColor = 'bg-white';
              const textColor = 'text-gray-800';
              
                if (isSelected) {
                borderColor = 'border-gray-400';
                bgColor = 'bg-gray-50';
              }

              return (
                <button
                    key={`${questions[currentQuestion].id}-${option.id}-${index}`}
                  onClick={() => handleAnswerSelect(option.id)}
                    disabled={false}
                  className={`${bgColor} ${borderColor} ${textColor} border-2 rounded-lg p-4 text-left transition-all hover:shadow-md disabled:cursor-not-allowed flex items-center justify-between`}
                >
                  <span className="font-medium">
                    {option.id}. {option.text}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Submit/Next Button */}
          <div className="flex justify-end">
              <button
                onClick={handleNext}
                disabled={!selectedAnswer}
                className="bg-orange-400 hover:bg-orange-500 text-white font-semibold px-8 py-3 rounded-lg shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {currentQuestion >= 19 ? 'Finish' : 'Next'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}