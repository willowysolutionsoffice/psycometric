// "use client";

// import { useState } from "react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Hand } from "lucide-react";

// interface InterestType {
//   name: string;
//   role: string;
//   score: number;
//   level: 'Low' | 'Moderate' | 'High';
//   description: string;
// }

// interface InterestsMeanProps {
//   interestTypes?: InterestType[];
// }

// export function InterestsMean({ interestTypes }: InterestsMeanProps) {
//   // Hardcoded data matching the image order and content
//   const defaultInterestTypes: InterestType[] = [
//     {
//       name: 'Investigative',
//       role: 'Thinker',
//       score: 6,
//       level: 'Moderate',
//       description: 'Your Investigative trait shows you are interested in areas that require research. You like to see how things work, analyze what you find, and solve problems. You are curious, self-motivated, and always looking for answers to the questions "How" and "Why".'
//     },
//     {
//       name: 'Artistic',
//       role: 'Creator',
//       score: 4,
//       level: 'Moderate',
//       description: 'Your artistic trait shows you like generating new ideas for most things. You don\'t like to follow a specific trend. You love having your freedom to express. You like variety and unstructured situations where you can freely use your creative skills.'
//     },
//     {
//       name: 'Realistic',
//       role: 'Do-er',
//       score: 3,
//       level: 'Low',
//       description: 'Your realistic trait shows you like to work with your hands, see the physical world, and engage in physical activities. You are adventurous, and often like to explore and experiment outdoors. You also prefer to work a problem through by doing something, rather than talking about it, or sitting and thinking about it. You are also drawn to concrete approaches to problem-solving.'
//     },
//     {
//       name: 'Enterprising',
//       role: 'Persuader',
//       score: 3,
//       level: 'Low',
//       description: 'Your enterprising trait shows that you like to work with others. You often like to lead the way to ensure that the job gets done. You usually work with a high degree of energy, and are always working towards finding solutions to the problem.'
//     },
//     {
//       name: 'Social',
//       role: 'Helper',
//       score: 7,
//       level: 'Moderate',
//       description: 'Your social trait indicates you enjoy working with people, helping them, and teaching them. You are cooperative, friendly, and understanding. You thrive in environments where you can interact and contribute to the well-being of others.'
//     },
//     {
//       name: 'Conventional',
//       role: 'Organizer',
//       score: 7,
//       level: 'Moderate',
//       description: 'Your conventional trait suggests you prefer structured tasks, working with data, and following clear procedures. You are organized, efficient, and detail-oriented. You excel in roles that require precision and adherence to rules.'
//     }
//   ];

//   const types = interestTypes || defaultInterestTypes;
//   const [activeTab, setActiveTab] = useState(3); // Start with Enterprising tab as shown in image

//   const getScoreColor = (level: string) => {
//     switch (level) {
//       case 'Low':
//         return 'text-orange-500';
//       case 'Moderate':
//         return 'text-teal-500';
//       case 'High':
//         return 'text-green-500';
//       default:
//         return 'text-gray-500';
//     }
//   };

//   const getTabColor = (level: string) => {
//     switch (level) {
//       case 'Low':
//         return 'bg-orange-500 text-white';
//       case 'Moderate':
//         return 'bg-teal-500 text-white';
//       case 'High':
//         return 'bg-green-500 text-white';
//       default:
//         return 'bg-gray-500 text-white';
//     }
//   };

//   const getInactiveTabColor = (level: string) => {
//     switch (level) {
//       case 'Low':
//         return 'text-orange-500 border-orange-500';
//       case 'Moderate':
//         return 'text-teal-500 border-teal-500';
//       case 'High':
//         return 'text-green-500 border-green-500';
//       default:
//         return 'text-gray-500 border-gray-500';
//     }
//   };

//   return (
//     <Card className="w-full border-2 border-teal-200 bg-white rounded-lg">
//       <CardHeader className="pb-4">
//         <CardTitle className="flex items-center space-x-2 text-gray-800 text-xl font-normal">
//           <Hand className="w-5 h-5 text-teal-500" />
//           <span>See What Other Interests Mean?</span>
//         </CardTitle>
//       </CardHeader>
//       <CardContent className="p-0">
//         {/* Tabs */}
//         <div className="flex flex-wrap border-b border-teal-200">
//           {types.map((type, index) => (
//             <Button
//               key={type.name}
//               variant="ghost"
//               className={`flex-1 min-w-0 px-3 py-3 text-sm font-normal border-0 rounded-none transition-all duration-200 ${
//                 activeTab === index
//                   ? `${getTabColor(type.level)} rounded-t-lg`
//                   : `bg-white ${getInactiveTabColor(type.level)} border-b-2 hover:bg-gray-50`
//               } ${
//                 index === 0 ? 'rounded-tl-lg' : ''
//               } ${
//                 index === types.length - 1 ? 'rounded-tr-lg' : ''
//               }`}
//               onClick={() => setActiveTab(index)}
//             >
//               <span className="truncate">
//                 {type.name} - The &apos;{type.role}&apos;
//               </span>
//             </Button>
//           ))}
//         </div>

//         {/* Content */}
//         <div className="p-6 border border-teal-200 border-t-0 rounded-b-lg bg-white">
//           <div className="space-y-4">
//             <h3 className={`text-lg font-semibold ${getScoreColor(types[activeTab].level)}`}>
//               Your {types[activeTab].name} score is {types[activeTab].level}
//             </h3>
//             <p className="text-gray-700 leading-relaxed">
//               {types[activeTab].description}
//             </p>
//           </div>
//         </div>
//       </CardContent>
//     </Card>
//   );
// }
"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
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

const relatedTypeContent: Record<string, { code: string; majors: string[]; pathways: string[] }> = {
  Realistic: {
    code: 'R',
    majors: [
      'Agriculture',
      'Health Assistant',
      'Computers',
      'Construction',
      'Mechanic/Machinist',
      'Engineering',
      'Food and Hospitality'
    ],
    pathways: [
      'Natural Resources',
      'Health Services',
      'Industrial and Engineering Technology',
      'Arts and Communication'
    ]
  },
  Investigative: {
    code: 'I',
    majors: [
      'Marine Biology',
      'Engineering',
      'Chemistry',
      'Zoology',
      'Medicine/Surgery',
      'Consumer Economics',
      'Psychology'
    ],
    pathways: [
      'Health Services',
      'Business',
      'Public and Human Services',
      'Industrial and Engineering Technology'
    ]
  },
  Social: {
    code: 'S',
    majors: [
      'Counseling',
      'Nursing',
      'Physical Therapy',
      'Travel',
      'Advertising',
      'Public Relations',
      'Education'
    ],
    pathways: [
      'Health Services',
      'Public and Human Services'
    ]
  },
  Enterprising: {
    code: 'E',
    majors: [
      'Fashion Merchandising',
      'Real Estate',
      'Marketing/Sales',
      'Law',
      'Political Science',
      'International Trade',
      'Banking/Finance'
    ],
    pathways: [
      'Business',
      'Public and Human Services',
      'Arts and Communication'
    ]
  },
  Conventional: {
    code: 'C',
    majors: [
      'Accounting',
      'Court Reporting',
      'Insurance',
      'Administration',
      'Medical Records',
      'Banking',
      'Data Processing'
    ],
    pathways: [
      'Health Services',
      'Business',
      'Industrial and Engineering Technology'
    ]
  }
};

export function InterestsMean({ interestTypes }: InterestsMeanProps) {
  const router = useRouter();
  const handleBookCounselorDemo = () => {
    router.push('/book-counselor');
  };

  // Hardcoded data matching the image order and content (without Artistic)
  const defaultInterestTypes: InterestType[] = [
    {
      name: 'Investigative',
      role: 'Thinker',
      score: 6,
      level: 'Moderate',
      description: 'These people like to watch, learn, analyze, and solve problems. You are curious, self-motivated, and always searching for answers to “How” and “Why”.'
    },
    {
      name: 'Realistic',
      role: 'Do-er',
      score: 3,
      level: 'Low',
      description: 'These people are often good at mechanical or athletic jobs. You enjoy working with your hands, focusing on tangible tasks, and seeing direct results from your work.'
    },
    {
      name: 'Enterprising',
      role: 'Persuader',
      score: 3,
      level: 'Low',
      description: 'These people enjoy persuading and performing with others. You like to take the lead, influence decisions, and drive ideas forward.'
    },
    {
      name: 'Social',
      role: 'Helper',
      score: 7,
      level: 'Moderate',
      description: 'These people like to work with other people rather than things. You enjoy helping, teaching, and collaborating to support others.'
    },
    {
      name: 'Conventional',
      role: 'Organizer',
      score: 7,
      level: 'Moderate',
      description: 'These people are detail-oriented and like to work with data and systems. You excel in structured settings that require organization, accuracy, and clear procedures.'
    }
  ];

  const filteredTypes = useMemo(() => {
    const source = interestTypes && interestTypes.length > 0 ? interestTypes : defaultInterestTypes;
    const withoutArtistic = source.filter((type) => type.name !== 'Artistic');
    return withoutArtistic.length > 0 ? withoutArtistic : defaultInterestTypes;
  }, [interestTypes]);

  const highestScoreTypes = useMemo(() => {
    if (!filteredTypes.length) return [];
    const topScore = Math.max(...filteredTypes.map((type) => type.score ?? 0));
    return filteredTypes.filter((type) => (type.score ?? 0) === topScore);
  }, [filteredTypes]);

  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    setActiveTab(0);
  }, [highestScoreTypes]);

  const displayTypes = highestScoreTypes.length > 0 ? highestScoreTypes : filteredTypes;
  const activeType =
    displayTypes[Math.min(activeTab, Math.max(displayTypes.length - 1, 0))] ?? displayTypes[0];
  const related = activeType ? relatedTypeContent[activeType.name as keyof typeof relatedTypeContent] : undefined;

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
          {displayTypes.map((type, index) => (
            <Button
              key={type.name}
              variant="ghost"
              className={`flex-1 min-w-0 px-3 py-3 text-sm font-normal border-0 rounded-none transition-all duration-200 ${
                activeTab === index
                  ? `${getTabColor(type.level)} rounded-t-lg`
                  : `bg-white ${getInactiveTabColor(type.level)} border-b-2 hover:bg-gray-50`
              } ${index === 0 ? 'rounded-tl-lg' : ''} ${
                index === displayTypes.length - 1 ? 'rounded-tr-lg' : ''
              } ${displayTypes.length === 1 ? 'pointer-events-none cursor-default' : ''}`}
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
            {activeType && (
              <>
                <h3 className={`text-lg font-semibold ${getScoreColor(activeType.level)}`}>
                  Your {activeType.name} score is {activeType.level}
                </h3>
                 <p className="text-gray-700 leading-relaxed">
                   {activeType.description}
                 </p>
                {related && (
                  <div className="mt-4 space-y-4 border-t border-gray-100 pt-4">
                    <div>
                      <p className="text-sm font-semibold text-gray-800 mb-2">
                        Good college majors for {related.code} ({activeType.name})
                      </p>
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1">
                         {(() => {
                           const midpoint = Math.ceil(related.majors.length / 2);
                           const columns = [
                             related.majors.slice(0, midpoint),
                             related.majors.slice(midpoint),
                           ].filter((col) => col.length > 0);
                           return columns.map((column, columnIndex) => (
                             <ul
                               key={columnIndex}
                               className="list-disc list-inside text-sm text-gray-600 space-y-1"
                             >
                               {column.map((major) => (
                                 <li key={major}>{major}</li>
                               ))}
                             </ul>
                           ));
                         })()}
                       </div>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-800 mb-2">Related pathways</p>
                      <div className="flex flex-wrap gap-2">
                        {related.pathways.map((pathway) => (
                          <span
                            key={pathway}
                            className="inline-flex items-center rounded-full bg-gray-100 text-gray-700 text-xs font-medium px-3 py-1"
                          >
                            {pathway}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </CardContent>
      
      {/* Action Buttons */}
      <div className="flex flex-col gap-4 p-5 border-t border-teal-100 bg-teal-50/40 rounded-b-lg sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-gray-700 sm:max-w-xl">
          Ready to take the next step? Book a counselor session to translate your strongest interest types into a focused study plan and confident career direction.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <Button
            variant="outline"
            className="w-full sm:w-auto border-orange-300 text-orange-600 hover:bg-orange-50 hover:text-orange-700"
            onClick={handleBookCounselorDemo}
          >
            Book Counselor
          </Button>
          <Button
            onClick={() => router.push('/')}
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-2 rounded-lg shadow-md transition-colors duration-200"
          >
            Home
          </Button>
        </div>
      </div>
    </Card>
  );
}