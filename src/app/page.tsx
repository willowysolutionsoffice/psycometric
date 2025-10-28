'use client'

import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { BookOpen, Brain, Users, BarChart3, LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

interface User {
  id: string
  name: string
  email: string
  role: string
  stream?: string
}

export default function HomePage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in
    const checkAuth = async () => {
      try {
        // This would typically come from your auth context or API
        // For now, we'll check localStorage
        const userData = localStorage.getItem('user')
        if (userData) {
          const parsedUser = JSON.parse(userData)
          setUser(parsedUser)
        }
      } catch (error) {
        console.error('Error checking auth:', error)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('user')
    setUser(null)
    toast.success('Logged out successfully')
    router.push('/login')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Psychometric Assessment</h1>
            <p className="text-gray-600 mt-2">Discover your potential through comprehensive testing</p>
          </div>
          
          {user ? (
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="font-medium text-gray-900">Welcome, {user.name}</p>
                {user.stream && (
                  <p className="text-sm text-gray-600">{user.stream}</p>
                )}
              </div>
              <Button onClick={handleLogout} variant="outline" size="sm">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          ) : (
            <div className="flex gap-2">
              <Button onClick={() => router.push('/login')} variant="outline">
                Login
              </Button>
              <Button onClick={() => router.push('/sign-up')}>
                Sign Up
              </Button>
            </div>
          )}
        </div>

        {/* Main Content */}
        {user ? (
          <div className="space-y-8">
            {/* Welcome Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-6 h-6 text-blue-600" />
                  Welcome to Your Dashboard
                </CardTitle>
                <CardDescription>
                  Access your psychometric assessments and track your progress
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <BookOpen className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <h3 className="font-semibold">Take Assessment</h3>
                    <p className="text-sm text-gray-600">Complete your psychometric tests</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <BarChart3 className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <h3 className="font-semibold">View Results</h3>
                    <p className="text-sm text-gray-600">Analyze your performance</p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <Users className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                    <h3 className="font-semibold">Compare</h3>
                    <p className="text-sm text-gray-600">See how you compare with others</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Get started with your assessments</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button className="w-full justify-start" variant="outline">
                    <BookOpen className="mr-2 h-4 w-4" />
                    Start New Assessment
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <BarChart3 className="mr-2 h-4 w-4" />
                    View Previous Results
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Your Progress</CardTitle>
                  <CardDescription>Track your assessment history</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center text-gray-500 py-4">
                    No assessments completed yet
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          <div className="text-center py-16">
            <Brain className="w-24 h-24 text-blue-600 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Ready to Discover Your Potential?
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Take our comprehensive psychometric assessments to understand your strengths, 
              personality traits, and career preferences.
            </p>
            <div className="flex gap-4 justify-center">
              <Button size="lg" onClick={() => router.push('/sign-up')}>
                Get Started
              </Button>
              <Button size="lg" variant="outline" onClick={() => router.push('/login')}>
                Sign In
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}