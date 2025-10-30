"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
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
  const [totalScore, setTotalScore] = useState<number | null>(null);
  const [byTypeScores, setByTypeScores] = useState<InterestScore[] | null>(null);
  const router = useRouter();
  useEffect(() => {
    try {
      const raw = typeof window !== 'undefined' ? localStorage.getItem('authUser') : null;
      if (!raw) {
        router.push('/login');
        return;
      }
      const user = JSON.parse(raw) as { id?: string };
      if (!user?.id) return;
      const load = () => fetch(`/api/results?userId=${user.id}`)
        .then(res => res.json())
        .then(data => {
          if (data?.result?.score !== undefined) {
            setTotalScore(data.result.score as number);
          } else {
            // brief retry in case of write-read race
            setTimeout(() => {
              fetch(`/api/results?userId=${user.id}`)
                .then(r => r.json())
                .then(d => {
                  if (d?.result?.score !== undefined) setTotalScore(d.result.score as number);
                })
                .catch(() => {});
            }, 700);
          }
          // Build per-type scores if details exist
          const details = data?.result?.details as { byType?: Record<string, number>, totals?: Record<string, number> } | undefined;
          if (details?.byType && details?.totals) {
            const items: InterestScore[] = Object.keys(details.totals).map((typeName) => {
              const correct = details.byType?.[typeName] ?? 0;
              const total = details.totals?.[typeName] ?? 0;
              const scaled = total > 0 ? Math.round((correct / total) * 10) : 0;
              let level: 'Low' | 'Moderate' | 'High' = 'Low';
              if (scaled >= 8) level = 'High';
              else if (scaled >= 4) level = 'Moderate';
              return { name: typeName, score: scaled, level };
            });
            setByTypeScores(items);
          }
        })
        .catch(() => {});
      load();
    } catch {}
  }, []);
  // Do not fallback to demo scores; prefer real saved total or provided scores
  const displayScores = scores ?? byTypeScores ?? null;

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
          Your Interest Score {totalScore !== null && (
            <span className="ml-2 inline-block bg-orange-100 text-orange-700 text-sm px-2 py-0.5 rounded-full align-middle">Total: {totalScore}</span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* If detailed scores provided, render them; otherwise show total only */}
        {Array.isArray(displayScores) && displayScores.length > 0 ? (
          <div className="space-y-4">
            {displayScores.map((score) => (
              <div key={score.name} className="flex items-center space-x-4">
                <div className="w-24 text-sm font-normal text-gray-700">
                  {score.name}
                </div>
                <div className="flex-1 relative">
                  <div className="absolute inset-0 flex">
                    <div className="w-1/3 border-r border-dashed border-gray-300"></div>
                    <div className="w-1/3 border-r border-dashed border-gray-300"></div>
                    <div className="w-1/3"></div>
                  </div>
                  <div className="relative h-8 flex items-center">
                    <div className="absolute inset-0 bg-gray-100 rounded"></div>
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
        ) : (
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="w-24 text-sm font-normal text-gray-700">Total</div>
              <div className="flex-1 relative">
                <div className="absolute inset-0 flex">
                  <div className="w-1/3 border-r border-dashed border-gray-300"></div>
                  <div className="w-1/3 border-r border-dashed border-gray-300"></div>
                  <div className="w-1/3"></div>
                </div>
                <div className="relative h-8 flex items-center">
                  <div className="absolute inset-0 bg-gray-100 rounded"></div>
                  <div 
                    className="absolute h-4 rounded bg-orange-400"
                    style={{ 
                      width: `${Math.min(100, Math.max(0, (Number(totalScore ?? 0) / 20) * 100))}%`,
                      left: 0,
                      top: '50%',
                      transform: 'translateY(-50%)'
                    }}
                  ></div>
                  <div 
                    className="absolute w-5 h-5 rounded-full border-2 shadow-sm flex items-center justify-center bg-white"
                    style={{ 
                      borderColor: '#fb923c',
                      left: `${Math.min(100, Math.max(0, (Number(totalScore ?? 0) / 20) * 100))}%`, 
                      top: '50%',
                      transform: 'translate(-50%, -50%)'
                    }}
                  >
                    <MapPin className="w-3 h-3" style={{ color: '#fb923c' }} />
                  </div>
                </div>
              </div>
              <div className="text-sm text-gray-700 min-w-[3rem] text-right">{totalScore ?? '-'}/20</div>
            </div>
          </div>
        )}

        {/* Legend (applies to detailed scores only) */}
        {Array.isArray(displayScores) && displayScores.length > 0 && (
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
        )}
      </CardContent>
    </Card>
  );
}
