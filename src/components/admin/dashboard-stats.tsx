// 'use client'

// import { useEffect, useState } from 'react'
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from '@/components/ui/card'
// import { BookOpen, GraduationCap, Layers, Users } from 'lucide-react'

// interface DashboardStats {
//   totalQuestions: number
//   totalStudents: number
//   totalCategories: number
//   totalStreams: number
// }

// interface StatCardProps {
//   title: string
//   value: number
//   description: string
//   icon: React.ReactNode
// }

// function StatCard({ title, value, description, icon }: StatCardProps) {
//   return (
//     <Card className="@container/card">
//       <CardHeader>
//         <CardDescription>{description}</CardDescription>
//         <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl flex items-center gap-2">
//           {icon}
//           {value.toLocaleString()}
//         </CardTitle>
//       </CardHeader>
//       <CardContent>
//         <p className="text-sm text-muted-foreground">{title}</p>
//       </CardContent>
//     </Card>
//   )
// }

// export function DashboardStats() {
//   const [stats, setStats] = useState<DashboardStats | null>(null)
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState<string | null>(null)

//   useEffect(() => {
//     async function fetchStats() {
//       try {
//         const response = await fetch('/api/admin/stats')
//         if (!response.ok) {
//           throw new Error('Failed to fetch statistics')
//         }
//         const data = await response.json()
//         setStats(data)
//       } catch (err) {
//         setError(err instanceof Error ? err.message : 'An error occurred')
//       } finally {
//         setLoading(false)
//       }
//     }

//     fetchStats()
//   }, [])

//   if (loading) {
//     return (
//       <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
//         {[1, 2, 3, 4].map((i) => (
//           <Card key={i} className="animate-pulse">
//             <CardHeader>
//               <div className="h-4 bg-muted rounded w-24 mb-2"></div>
//               <div className="h-8 bg-muted rounded w-16"></div>
//             </CardHeader>
//             <CardContent>
//               <div className="h-4 bg-muted rounded w-32"></div>
//             </CardContent>
//           </Card>
//         ))}
//       </div>
//     )
//   }

//   if (error) {
//     return (
//       <Card className="border-destructive">
//         <CardHeader>
//           <CardTitle className="text-destructive">Error</CardTitle>
//           <CardDescription>{error}</CardDescription>
//         </CardHeader>
//       </Card>
//     )
//   }

//   if (!stats) {
//     return null
//   }

//   return (
//     <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
//       <StatCard
//         title="Total Questions"
//         value={stats.totalQuestions}
//         description="Questions in database"
//         icon={<BookOpen className="h-6 w-6 text-primary" />}
//       />
//       <StatCard
//         title="Total Students"
//         value={stats.totalStudents}
//         description="Registered students"
//         icon={<Users className="h-6 w-6 text-primary" />}
//       />
//       <StatCard
//         title="Total Categories"
//         value={stats.totalCategories}
//         description="Question categories"
//         icon={<Layers className="h-6 w-6 text-primary" />}
//       />
//       <StatCard
//         title="Total Streams"
//         value={stats.totalStreams}
//         description="Available streams"
//         icon={<GraduationCap className="h-6 w-6 text-primary" />}
//       />
//     </div>
//   )
// }

'use client'

import { useEffect, useState } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { BookOpen, GraduationCap, Layers, Users } from 'lucide-react'

interface DashboardStats {
  totalQuestions: number
  totalStudents: number
  totalCategories: number
  totalStreams: number
}

interface StatCardProps {
  title: string
  value: number
  description: string
  icon: React.ReactNode
}

function StatCard({ title, value, description, icon }: StatCardProps) {
  return (
    <Card className="@container/card">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex-1">
          <CardDescription>{description}</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl flex items-center gap-2 mt-2">
            {icon}
            {value.toLocaleString()}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{title}</p>
      </CardContent>
    </Card>
  )
}

export function DashboardStats() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch('/api/admin/stats')
        if (!response.ok) {
          throw new Error('Failed to fetch statistics')
        }
        const data = await response.json()
        setStats(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 px-4 lg:px-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-muted rounded w-24 mb-2"></div>
              <div className="h-8 bg-muted rounded w-16"></div>
            </CardHeader>
            <CardContent>
              <div className="h-4 bg-muted rounded w-32"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive">Error</CardTitle>
          <CardDescription>{error}</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  if (!stats) {
    return null
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 px-4 lg:px-6">
      <StatCard
        title="Total Questions"
        value={stats.totalQuestions}
        description="Questions in database"
        icon={<BookOpen className="h-6 w-6 text-primary" />}
      />
      <StatCard
        title="Total Students"
        value={stats.totalStudents}
        description="Registered students"
        icon={<Users className="h-6 w-6 text-primary" />}
      />
      <StatCard
        title="Total Categories"
        value={stats.totalCategories}
        description="Question categories"
        icon={<Layers className="h-6 w-6 text-primary" />}
      />
      <StatCard
        title="Total Streams"
        value={stats.totalStreams}
        description="Available streams"
        icon={<GraduationCap className="h-6 w-6 text-primary" />}
      />
    </div>
  )
}