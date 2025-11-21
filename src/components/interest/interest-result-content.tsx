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

const personalityDescriptions: Record<string, { role: string; description: string }> = {
  'Realistic': {
    role: 'Do-er',
    description: 'These people are often good at mechanical or athletic jobs. You enjoy working with your hands, focusing on tangible tasks, and seeing direct results from your work.'
  },
  'Investigative': {
    role: 'Thinker',
    description: 'These people like to watch, learn, analyze, and solve problems. You are curious, self-motivated, and always searching for answers to “How” and “Why”.'
  },
  'Artistic': {
    role: 'Creator',
    description: 'These people like to work in unstructured situations where they can use their creativity, explore ideas, and express themselves freely.'
  },
  'Social': {
    role: 'Helper',
    description: 'These people like to work with other people rather than things. You enjoy helping, teaching, and collaborating to support others.'
  },
  'Enterprising': {
    role: 'Persuader',
    description: 'These people enjoy persuading and performing with others. You like to take the lead, influence decisions, and drive ideas forward.'
  },
  'Conventional': {
    role: 'Organizer',
    description: 'These people are detail-oriented and like to work with data and systems. You excel in structured settings that require organization, accuracy, and clear procedures.'
  }
};

export default function InterestResultContent() {
  const router = useRouter();
  const [scores, setScores] = useState<InterestScore[]>([]);
  const [interestTypes, setInterestTypes] = useState<InterestType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const raw = typeof window !== 'undefined' ? localStorage.getItem('authUser') : null;
      if (!raw) {
        router.push('/login');
        return;
      }
      const user = JSON.parse(raw) as { id?: string };
      if (!user?.id) {
        router.push('/login');
        return;
      }

      fetch(`/api/results?userId=${user.id}`)
        .then(res => res.json())
        .then(data => {
          if (!data?.result) {
            router.push('/test-questions');
            return;
          }
          const details = data.result.details as { byType?: Record<string, number>, totals?: Record<string, number> } | undefined;
          if (details?.byType && details?.totals) {
            const personalityStats: InterestScore[] = Object.keys(details.totals).map(type => {
              const correct = details.byType?.[type] ?? 0;
              const total = details.totals?.[type] ?? 0;
              const score = total > 0 ? Math.round((correct / total) * 10) : 0;
              let level: 'Low' | 'Moderate' | 'High' = 'Low';
              if (score >= 8) level = 'High';
              else if (score >= 4) level = 'Moderate';
              return { name: type, score, level };
            });
            const interestTypesData: InterestType[] = personalityStats.map(stat => ({
              name: stat.name,
              role: personalityDescriptions[stat.name]?.role || '',
              score: stat.score,
              level: stat.level,
              description: personalityDescriptions[stat.name]?.description || '',
            }));
            setScores(personalityStats);
            setInterestTypes(interestTypesData);
          }
          setLoading(false);
        })
        .catch(() => {
          router.push('/test-questions');
        });
    } catch {
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
        <InterestsMean interestTypes={interestTypes} />
      </div>
    </div>
  );
}

