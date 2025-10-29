"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Hand } from "lucide-react";

interface InterestType {
  name: string;
  role: string;
  score: number;
  level: 'Low' | 'Moderate' | 'High';
  description: string;
}

interface InterestsMeanProps {
  interestTypes?: InterestType[];
}

export function InterestsMean({ interestTypes }: InterestsMeanProps) {
  // Hardcoded data matching the image order and content
  const defaultInterestTypes: InterestType[] = [
    {
      name: 'Investigative',
      role: 'Thinker',
      score: 6,
      level: 'Moderate',
      description: 'Your Investigative trait shows you are interested in areas that require research. You like to see how things work, analyze what you find, and solve problems. You are curious, self-motivated, and always looking for answers to the questions "How" and "Why".'
    },
    {
      name: 'Artistic',
      role: 'Creator',
      score: 4,
      level: 'Moderate',
      description: 'Your artistic trait shows you like generating new ideas for most things. You don\'t like to follow a specific trend. You love having your freedom to express. You like variety and unstructured situations where you can freely use your creative skills.'
    },
    {
      name: 'Realistic',
      role: 'Do-er',
      score: 3,
      level: 'Low',
      description: 'Your realistic trait shows you like to work with your hands, see the physical world, and engage in physical activities. You are adventurous, and often like to explore and experiment outdoors. You also prefer to work a problem through by doing something, rather than talking about it, or sitting and thinking about it. You are also drawn to concrete approaches to problem-solving.'
    },
    {
      name: 'Enterprising',
      role: 'Persuader',
      score: 3,
      level: 'Low',
      description: 'Your enterprising trait shows that you like to work with others. You often like to lead the way to ensure that the job gets done. You usually work with a high degree of energy, and are always working towards finding solutions to the problem.'
    },
    {
      name: 'Social',
      role: 'Helper',
      score: 7,
      level: 'Moderate',
      description: 'Your social trait indicates you enjoy working with people, helping them, and teaching them. You are cooperative, friendly, and understanding. You thrive in environments where you can interact and contribute to the well-being of others.'
    },
    {
      name: 'Conventional',
      role: 'Organizer',
      score: 7,
      level: 'Moderate',
      description: 'Your conventional trait suggests you prefer structured tasks, working with data, and following clear procedures. You are organized, efficient, and detail-oriented. You excel in roles that require precision and adherence to rules.'
    }
  ];

  const types = interestTypes || defaultInterestTypes;
  const [activeTab, setActiveTab] = useState(3); // Start with Enterprising tab as shown in image

  const getScoreColor = (level: string) => {
    switch (level) {
      case 'Low':
        return 'text-orange-500';
      case 'Moderate':
        return 'text-teal-500';
      case 'High':
        return 'text-green-500';
      default:
        return 'text-gray-500';
    }
  };

  const getTabColor = (level: string) => {
    switch (level) {
      case 'Low':
        return 'bg-orange-500 text-white';
      case 'Moderate':
        return 'bg-teal-500 text-white';
      case 'High':
        return 'bg-green-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const getInactiveTabColor = (level: string) => {
    switch (level) {
      case 'Low':
        return 'text-orange-500 border-orange-500';
      case 'Moderate':
        return 'text-teal-500 border-teal-500';
      case 'High':
        return 'text-green-500 border-green-500';
      default:
        return 'text-gray-500 border-gray-500';
    }
  };

  return (
    <Card className="w-full border-2 border-teal-200 bg-white rounded-lg">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center space-x-2 text-gray-800 text-xl font-normal">
          <Hand className="w-5 h-5 text-teal-500" />
          <span>See What Other Interests Mean?</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {/* Tabs */}
        <div className="flex flex-wrap border-b border-teal-200">
          {types.map((type, index) => (
            <Button
              key={type.name}
              variant="ghost"
              className={`flex-1 min-w-0 px-3 py-3 text-sm font-normal border-0 rounded-none transition-all duration-200 ${
                activeTab === index
                  ? `${getTabColor(type.level)} rounded-t-lg`
                  : `bg-white ${getInactiveTabColor(type.level)} border-b-2 hover:bg-gray-50`
              } ${
                index === 0 ? 'rounded-tl-lg' : ''
              } ${
                index === types.length - 1 ? 'rounded-tr-lg' : ''
              }`}
              onClick={() => setActiveTab(index)}
            >
              <span className="truncate">
                {type.name} - The &apos;{type.role}&apos;
              </span>
            </Button>
          ))}
        </div>

        {/* Content */}
        <div className="p-6 border border-teal-200 border-t-0 rounded-b-lg bg-white">
          <div className="space-y-4">
            <h3 className={`text-lg font-semibold ${getScoreColor(types[activeTab].level)}`}>
              Your {types[activeTab].name} score is {types[activeTab].level}
            </h3>
            <p className="text-gray-700 leading-relaxed">
              {types[activeTab].description}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
