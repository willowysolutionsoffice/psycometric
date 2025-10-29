"use client"

import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, User, Info } from 'lucide-react';

// Hardcoded questions and answers
const questions = [
  {
    id: 1,
    question: "The study of forces and the resulting motion of objects through the air?",
    options: [
      { id: 'A', text: 'Aeronautics' },
      { id: 'B', text: 'Astrophysics' },
      { id: 'C', text: 'Aerodynamics' },
      { id: 'D', text: 'Astrology' }
    ],
    correctAnswer: 'C',
    explanation: "Aerodynamics is the study of how air moves around things. So, anything that moves in the air reacts to dynamics therefore it studies the effects of the motion of a large airliner, a model rocket, a beach ball thrown near the shore, or a kite flying high overhead."
  },
  {
    id: 2,
    question: "What is the largest planet in our solar system?",
    options: [
      { id: 'A', text: 'Earth' },
      { id: 'B', text: 'Jupiter' },
      { id: 'C', text: 'Saturn' },
      { id: 'D', text: 'Mars' }
    ],
    correctAnswer: 'B',
    explanation: "Jupiter is the largest planet in our solar system, with a diameter of about 143,000 kilometers."
  },
  {
    id: 3,
    question: "Which programming language is known for web development?",
    options: [
      { id: 'A', text: 'Python' },
      { id: 'B', text: 'JavaScript' },
      { id: 'C', text: 'C++' },
      { id: 'D', text: 'Swift' }
    ],
    correctAnswer: 'B',
    explanation: "JavaScript is primarily known for web development and runs in web browsers to create interactive websites."
  },
  {
    id: 4,
    question: "What is the chemical symbol for gold?",
    options: [
      { id: 'A', text: 'Go' },
      { id: 'B', text: 'Gd' },
      { id: 'C', text: 'Au' },
      { id: 'D', text: 'Ag' }
    ],
    correctAnswer: 'C',
    explanation: "Au comes from the Latin word 'aurum' meaning gold."
  },
  {
    id: 5,
    question: "Who painted the Mona Lisa?",
    options: [
      { id: 'A', text: 'Vincent van Gogh' },
      { id: 'B', text: 'Pablo Picasso' },
      { id: 'C', text: 'Leonardo da Vinci' },
      { id: 'D', text: 'Michelangelo' }
    ],
    correctAnswer: 'C',
    explanation: "Leonardo da Vinci painted the Mona Lisa in the early 16th century."
  },
  {
    id: 6,
    question: "What is the speed of light in vacuum?",
    options: [
      { id: 'A', text: '300,000 km/s' },
      { id: 'B', text: '150,000 km/s' },
      { id: 'C', text: '450,000 km/s' },
      { id: 'D', text: '200,000 km/s' }
    ],
    correctAnswer: 'A',
    explanation: "The speed of light in vacuum is approximately 300,000 kilometers per second."
  },
  {
    id: 7,
    question: "Which organ pumps blood through the body?",
    options: [
      { id: 'A', text: 'Lungs' },
      { id: 'B', text: 'Brain' },
      { id: 'C', text: 'Heart' },
      { id: 'D', text: 'Liver' }
    ],
    correctAnswer: 'C',
    explanation: "The heart is a muscular organ that pumps blood throughout the body."
  },
  {
    id: 8,
    question: "What is the capital of France?",
    options: [
      { id: 'A', text: 'London' },
      { id: 'B', text: 'Berlin' },
      { id: 'C', text: 'Paris' },
      { id: 'D', text: 'Madrid' }
    ],
    correctAnswer: 'C',
    explanation: "Paris is the capital and largest city of France."
  },
  {
    id: 9,
    question: "Which element has the atomic number 1?",
    options: [
      { id: 'A', text: 'Helium' },
      { id: 'B', text: 'Hydrogen' },
      { id: 'C', text: 'Oxygen' },
      { id: 'D', text: 'Carbon' }
    ],
    correctAnswer: 'B',
    explanation: "Hydrogen is the lightest element with atomic number 1."
  },
  {
    id: 10,
    question: "What year did World War II end?",
    options: [
      { id: 'A', text: '1943' },
      { id: 'B', text: '1944' },
      { id: 'C', text: '1945' },
      { id: 'D', text: '1946' }
    ],
    correctAnswer: 'C',
    explanation: "World War II ended in 1945 with the surrender of Germany and Japan."
  },
  {
    id: 11,
    question: "What is the smallest unit of life?",
    options: [
      { id: 'A', text: 'Atom' },
      { id: 'B', text: 'Cell' },
      { id: 'C', text: 'Molecule' },
      { id: 'D', text: 'Organ' }
    ],
    correctAnswer: 'B',
    explanation: "The cell is the smallest unit of life that can function independently."
  },
  {
    id: 12,
    question: "Which planet is known as the Red Planet?",
    options: [
      { id: 'A', text: 'Venus' },
      { id: 'B', text: 'Mars' },
      { id: 'C', text: 'Jupiter' },
      { id: 'D', text: 'Saturn' }
    ],
    correctAnswer: 'B',
    explanation: "Mars is known as the Red Planet due to its reddish appearance caused by iron oxide on its surface."
  },
  {
    id: 13,
    question: "What is the boiling point of water at sea level?",
    options: [
      { id: 'A', text: '90°C' },
      { id: 'B', text: '100°C' },
      { id: 'C', text: '110°C' },
      { id: 'D', text: '120°C' }
    ],
    correctAnswer: 'B',
    explanation: "Water boils at 100°C (212°F) at sea level under normal atmospheric pressure."
  },
  {
    id: 14,
    question: "Who wrote 'Romeo and Juliet'?",
    options: [
      { id: 'A', text: 'Charles Dickens' },
      { id: 'B', text: 'William Shakespeare' },
      { id: 'C', text: 'Jane Austen' },
      { id: 'D', text: 'Mark Twain' }
    ],
    correctAnswer: 'B',
    explanation: "William Shakespeare wrote the tragic play 'Romeo and Juliet' in the 1590s."
  },
  {
    id: 15,
    question: "What is the largest ocean on Earth?",
    options: [
      { id: 'A', text: 'Atlantic Ocean' },
      { id: 'B', text: 'Indian Ocean' },
      { id: 'C', text: 'Pacific Ocean' },
      { id: 'D', text: 'Arctic Ocean' }
    ],
    correctAnswer: 'C',
    explanation: "The Pacific Ocean is the largest ocean, covering about 46% of Earth's water surface."
  },
  {
    id: 16,
    question: "What is the square root of 144?",
    options: [
      { id: 'A', text: '10' },
      { id: 'B', text: '11' },
      { id: 'C', text: '12' },
      { id: 'D', text: '13' }
    ],
    correctAnswer: 'C',
    explanation: "12 × 12 = 144, so the square root of 144 is 12."
  },
  {
    id: 17,
    question: "Which gas do plants absorb from the atmosphere?",
    options: [
      { id: 'A', text: 'Oxygen' },
      { id: 'B', text: 'Carbon Dioxide' },
      { id: 'C', text: 'Nitrogen' },
      { id: 'D', text: 'Hydrogen' }
    ],
    correctAnswer: 'B',
    explanation: "Plants absorb carbon dioxide during photosynthesis and release oxygen."
  },
  {
    id: 18,
    question: "What is the currency of Japan?",
    options: [
      { id: 'A', text: 'Yuan' },
      { id: 'B', text: 'Won' },
      { id: 'C', text: 'Yen' },
      { id: 'D', text: 'Rupee' }
    ],
    correctAnswer: 'C',
    explanation: "The yen is the official currency of Japan."
  },
  {
    id: 19,
    question: "How many continents are there?",
    options: [
      { id: 'A', text: '5' },
      { id: 'B', text: '6' },
      { id: 'C', text: '7' },
      { id: 'D', text: '8' }
    ],
    correctAnswer: 'C',
    explanation: "There are 7 continents: Africa, Antarctica, Asia, Europe, North America, Oceania, and South America."
  },
  {
    id: 20,
    question: "What is the hardest natural substance on Earth?",
    options: [
      { id: 'A', text: 'Gold' },
      { id: 'B', text: 'Iron' },
      { id: 'C', text: 'Diamond' },
      { id: 'D', text: 'Platinum' }
    ],
    correctAnswer: 'C',
    explanation: "Diamond is the hardest naturally occurring substance on Earth."
  }
];

export default function TestQuestions() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [completedQuestions, setCompletedQuestions] = useState(0);
  const [timer, setTimer] = useState(0);

  // Timer effect
  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

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

  const handleSubmit = () => {
    setIsSubmitted(true);
    setCompletedQuestions(completedQuestions + 1);
  };

  const handleNext = () => {
    setCurrentQuestion(currentQuestion + 1);
    setSelectedAnswer(null);
    setIsSubmitted(false);
  };

  const isCorrect = selectedAnswer === questions[currentQuestion].correctAnswer;
  const progressPercentage = (completedQuestions / 20) * 100;

  return (
    <div className="min-h-screen bg-orange-50">
      {/* Top Header Bar */}
      <div className="bg-orange-50 px-4 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          {/* Title */}
          <h2 className="text-lg md:text-xl font-semibold text-orange-600">
            Aerospace Engineering
          </h2>

          {/* Right side icons */}
          <div className="flex items-center gap-4">
            {/* Info Icon */}
            <button className="w-10 h-10 bg-cyan-500 rounded-full flex items-center justify-center hover:bg-cyan-600 transition-colors">
              <Info className="w-5 h-5 text-white" />
            </button>

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
              {questions[currentQuestion].options.map((option) => {
                const isSelected = selectedAnswer === option.id;
                const isCorrectAnswer = option.id === questions[currentQuestion].correctAnswer;
                
                let borderColor = 'border-gray-300';
                let bgColor = 'bg-white';
                let textColor = 'text-gray-800';
                
                if (isSubmitted) {
                  if (isSelected && !isCorrect) {
                    borderColor = 'border-orange-500';
                    bgColor = 'bg-orange-50';
                    textColor = 'text-orange-600';
                  } else if (isCorrectAnswer) {
                    borderColor = 'border-cyan-500';
                    bgColor = 'bg-cyan-50';
                    textColor = 'text-cyan-600';
                  }
                } else if (isSelected) {
                  borderColor = 'border-gray-400';
                  bgColor = 'bg-gray-50';
                }

                return (
                  <button
                    key={option.id}
                    onClick={() => handleAnswerSelect(option.id)}
                    disabled={isSubmitted}
                    className={`${bgColor} ${borderColor} ${textColor} border-2 rounded-lg p-4 text-left transition-all hover:shadow-md disabled:cursor-not-allowed flex items-center justify-between`}
                  >
                    <span className="font-medium">
                      {option.id}. {option.text}
                    </span>
                    {isSubmitted && (
                      <>
                        {isSelected && !isCorrect && (
                          <XCircle className="w-6 h-6 text-orange-500" />
                        )}
                        {isCorrectAnswer && (
                          <CheckCircle className="w-6 h-6 text-cyan-500" />
                        )}
                      </>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Feedback Message */}
            {isSubmitted && (
              <div className={`mb-8 p-6 rounded-lg border-2 ${
                isCorrect 
                  ? 'bg-cyan-50 border-cyan-200' 
                  : 'bg-orange-50 border-orange-200'
              }`}>
                <h3 className={`text-xl font-bold mb-3 ${
                  isCorrect ? 'text-cyan-600' : 'text-orange-600'
                }`}>
                  {isCorrect ? 'Correct!' : 'Oh no!'}
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  &quot;{questions[currentQuestion].explanation}&quot;
                </p>
              </div>
            )}

            {/* Submit/Next Button */}
            <div className="flex justify-end">
              {!isSubmitted ? (
                <button
                  onClick={handleSubmit}
                  disabled={!selectedAnswer}
                  className="bg-orange-400 hover:bg-orange-500 text-white font-semibold px-8 py-3 rounded-lg shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Submit
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  disabled={currentQuestion >= 19}
                  className="bg-orange-400 hover:bg-orange-500 text-white font-semibold px-8 py-3 rounded-lg shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {currentQuestion >= 19 ? 'Completed' : 'Next'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}