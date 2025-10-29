"use client";

import { InterestResult } from "@/components/interest/interest-result";
import { InterestsMean } from "@/components/interest/interests-mean";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface AnswerResult {
  questionId: string;
  personalityType: string | null;
  isCorrect: boolean;
}

interface TestResults {
  answers: AnswerResult[];
  timestamp: string;
}

interface InterestScore {
  name: string;
  score: number;
  level: 'Low' | 'Moderate' | 'High';
}

interface InterestType {
  name: string;
  role: string;
  score: number;
  level: 'Low' | 'Moderate' | 'High';
  description: string;
}

// Personality type descriptions
const personalityDescriptions: Record<string, { role: string; description: string }> = {
  'Realistic': {
    role: 'Do-er',
    description: 'Your realistic trait shows you like to work with your hands, see the physical world, and engage in physical activities. You are adventurous, and often like to explore and experiment outdoors. You also prefer to work a problem through by doing something, rather than talking about it, or sitting and thinking about it. You are also drawn to concrete approaches to problem-solving.'
  },
  'Investigative': {
    role: 'Thinker',
    description: 'Your Investigative trait shows you are interested in areas that require research. You like to see how things work, analyze what you find, and solve problems. You are curious, self-motivated, and always looking for answers to the questions "How" and "Why".'
  },
  'Artistic': {
    role: 'Creator',
    description: 'Your artistic trait shows you like generating new ideas for most things. You don\'t like to follow a specific trend. You love having your freedom to express. You like variety and unstructured situations where you can freely use your creative skills.'
  },
  'Social': {
    role: 'Helper',
    description: 'Your social trait indicates you enjoy working with people, helping them, and teaching them. You are cooperative, friendly, and understanding. You thrive in environments where you can interact and contribute to the well-being of others.'
  },
  'Enterprising': {
    role: 'Persuader',
    description: 'Your enterprising trait shows that you like to work with others. You often like to lead the way to ensure that the job gets done. You usually work with a high degree of energy, and are always working towards finding solutions to the problem.'
  },
  'Conventional': {
    role: 'Organizer',
    description: 'Your conventional trait suggests you prefer structured tasks, working with data, and following clear procedures. You are organized, efficient, and detail-oriented. You excel in roles that require precision and adherence to rules.'
  }
};

export default function InterestResultContent() {
  const router = useRouter();
  const [scores, setScores] = useState<InterestScore[]>([]);
  const [interestTypes, setInterestTypes] = useState<InterestType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get test results from localStorage
    const testResultsJson = localStorage.getItem('testResults');
    
    if (!testResultsJson) {
      // No results found, redirect to test page
      router.push('/test-questions');
      return;
    }

    try {
      const testResults: TestResults = JSON.parse(testResultsJson);
      
      // Calculate scores per personality type
      const personalityTypes = [
        'Realistic',
        'Investigative',
        'Artistic',
        'Social',
        'Enterprising',
        'Conventional'
      ];

      const personalityStats = personalityTypes.map(type => {
        // Filter answers for this personality type
        const typeAnswers = testResults.answers.filter(
          answer => answer.personalityType === type
        );
        
        // Count correct answers
        const correctCount = typeAnswers.filter(answer => answer.isCorrect).length;
        const totalCount = typeAnswers.length;
        
        // Calculate score (0-10 scale based on percentage)
        // If no questions for this type, score is 0
        const percentage = totalCount > 0 ? (correctCount / totalCount) * 100 : 0;
        const score = Math.round((percentage / 100) * 10); // Scale to 0-10
        
        // Determine level
        let level: 'Low' | 'Moderate' | 'High';
        if (score >= 8) {
          level = 'High';
        } else if (score >= 4) {
          level = 'Moderate';
        } else {
          level = 'Low';
        }

        return {
          name: type,
          score: score,
          level: level,
        };
      });

      // Create InterestType objects for InterestsMean component
      const interestTypesData: InterestType[] = personalityStats.map(stat => ({
        name: stat.name,
        role: personalityDescriptions[stat.name]?.role || '',
        score: stat.score,
        level: stat.level,
        description: personalityDescriptions[stat.name]?.description || '',
      }));

      // Batch state updates
      requestAnimationFrame(() => {
        setScores(personalityStats);
        setInterestTypes(interestTypesData);
        setLoading(false);
      });
    } catch (error) {
      console.error('Error parsing test results:', error);
      router.push('/test-questions');
    }
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-orange-600 font-semibold">Calculating your results...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen  py-12">
      <div className="container mx-auto px-6 space-y-12">
        {/* Interest Result Component */}
        <InterestResult scores={scores} />
        
        {/* Interests Mean Component */}
        <InterestsMean interestTypes={interestTypes} />
      </div>
    </div>
  );
}

