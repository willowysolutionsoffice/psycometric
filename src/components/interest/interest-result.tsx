"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin } from "lucide-react";

interface InterestScore {
  name: string;
  score: number;
  level: 'Low' | 'Moderate' | 'High';
}

interface InterestResultProps {
  scores?: InterestScore[];
}

export function InterestResult({ scores }: InterestResultProps) {
  // Hardcoded data matching the image exactly
  const defaultScores: InterestScore[] = [
    { name: 'Realistic', score: 3, level: 'Low' },
    { name: 'Investigative', score: 6, level: 'Moderate' },
    { name: 'Artistic', score: 4, level: 'Moderate' },
    { name: 'Social', score: 7, level: 'Moderate' },
    { name: 'Enterprising', score: 3, level: 'Low' },
    { name: 'Conventional', score: 7, level: 'Moderate' },
  ];

  const displayScores = scores || defaultScores;

  const getScoreColor = (level: string) => {
    switch (level) {
      case 'Low':
        return '#F08050'; // Orange
      case 'Moderate':
        return '#34B0B0'; // Teal
      case 'High':
        return '#8BC34A'; // Lime green
      default:
        return '#666666';
    }
  };


  return (
    <Card className="w-full border-2 border-orange-200 bg-white rounded-lg">
      <CardHeader className="pb-2">
        <CardTitle className="text-orange-400 text-xl font-normal">
          Your Interest Score
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Score Bars */}
        <div className="space-y-4">
          {displayScores.map((score) => (
            <div key={score.name} className="flex items-center space-x-4">
              <div className="w-24 text-sm font-normal text-gray-700">
                {score.name}
              </div>
              <div className="flex-1 relative">
                {/* Background grid lines */}
                <div className="absolute inset-0 flex">
                  <div className="w-1/3 border-r border-dashed border-gray-300"></div>
                  <div className="w-1/3 border-r border-dashed border-gray-300"></div>
                  <div className="w-1/3"></div>
                </div>
                
                {/* Score bar - only colored up to the actual score, remaining is gray */}
                <div className="relative h-8 flex items-center">
                  {/* Background bar (light gray for entire length) */}
                  <div className="absolute inset-0 bg-gray-100 rounded"></div>
                  
                  {/* Colored segment only up to the score */}
                  <div 
                    className="absolute h-4 rounded"
                    style={{ 
                      width: `${(score.score / 10) * 100}%`,
                      backgroundColor: getScoreColor(score.level),
                      left: 0,
                      top: '50%',
                      transform: 'translateY(-50%)'
                    }}
                  ></div>
                  
                  {/* Location icon at the score position */}
                  <div 
                    className="absolute w-5 h-5 rounded-full border-2 shadow-sm flex items-center justify-center bg-white"
                    style={{ 
                      borderColor: getScoreColor(score.level),
                      left: `${(score.score / 10) * 100}%`, 
                      top: '50%',
                      transform: 'translate(-50%, -50%)'
                    }}
                  >
                    <MapPin className="w-3 h-3 text-white" style={{ color: getScoreColor(score.level) }} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Score Range Labels */}
        <div className="flex justify-center items-center space-x-8 text-sm">
          <div className="text-center">
            <div className="w-4 h-4 bg-orange-400 mx-auto mb-1"></div>
            <span className="text-orange-500">Low (Score 1-3)</span>
          </div>
          <div className="text-center">
            <div className="w-4 h-4 bg-teal-400 mx-auto mb-1"></div>
            <span className="text-teal-500">Moderate (Score 4-7)</span>
          </div>
          <div className="text-center">
            <div className="w-4 h-4 bg-lime-400 mx-auto mb-1"></div>
            <span className="text-lime-500">High (Score 8-10)</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
