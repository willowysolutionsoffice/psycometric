'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Trash2, Calendar, Mail, Phone, GraduationCap, Eye } from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { toast } from 'sonner'

interface User {
  id: string
  name: string
  email: string
  phoneNumber?: string
  stream?: string
  role?: string
  banned?: boolean
  createdAt: string
  updatedAt: string
}

export default function StudentsPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [viewOpen, setViewOpen] = useState(false)
  const [viewUser, setViewUser] = useState<User | null>(null)
  const [resultLoading, setResultLoading] = useState(false)
  const [resultError, setResultError] = useState<string | null>(null)
  const [resultData, setResultData] = useState<
    | null
    | {
        score?: number
        attemptedAt?: string
        details?: { byType?: Record<string, number>; totals?: Record<string, number> }
      }
  >(null)

  // Fetch users
  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users')
      if (response.ok) {
        const data = await response.json()
        const onlyStudents = Array.isArray(data)
          ? data.filter((u: User) => (u.role || '').toLowerCase() !== 'admin')
          : []
        setUsers(onlyStudents)
      } else {
        toast.error('Failed to fetch users')
      }
    } catch {
      toast.error('Error fetching users')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleViewUser = async (user: User) => {
    setViewUser(user)
    setResultLoading(true)
    setResultError(null)
    setResultData(null)
    setViewOpen(true)
    try {
      const res = await fetch(`/api/results?userId=${user.id}`)
      if (!res.ok) throw new Error('Failed to fetch result')
      const data = await res.json()
      // Expected shape: { exists: boolean, result?: {...} } OR direct result
      if (data?.exists === false) {
        setResultData(null)
      } else if (data?.result) {
        setResultData(data.result)
      } else {
        setResultData(data)
      }
    } catch {
      setResultError('Failed to load test result')
    } finally {
      setResultLoading(false)
    }
  }


  // Delete user
  const handleDeleteUser = async (userId: string) => {
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast.success('User deleted successfully')
        fetchUsers()
      } else {
        toast.error('Failed to delete user')
      }
    } catch {
      toast.error('Error deleting user')
    }
  }


  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
          <p className="mt-4 text-gray-600">Loading users...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Students</h1>
          <p className="text-gray-600">View registered students</p>
        </div>
      </div>

      {users.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">No students found</h3>
              <p className="text-gray-600 mb-4">No students have registered yet.</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Students</CardTitle>
            <CardDescription>View registered students</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Stream</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-gray-400" />
                        {user.email}
                      </div>
                    </TableCell>
                    <TableCell>
                      {user.phoneNumber ? (
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-gray-400" />
                          {user.phoneNumber}
                        </div>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {user.stream ? (
                        <div className="flex items-center gap-2">
                          <GraduationCap className="w-4 h-4 text-gray-400" />
                          {user.stream}
                        </div>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.role === 'admin' 
                          ? 'bg-red-100 text-red-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {user.role || 'student'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.banned 
                          ? 'bg-red-100 text-red-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {user.banned ? 'Banned' : 'Active'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(user.createdAt).toLocaleDateString()}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="inline-flex items-center gap-1">
                        <Button variant="ghost" size="sm" onClick={() => handleViewUser(user)} title="View details">
                          <Eye className="w-4 h-4" />
                        </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete the user &quot;{user.name}&quot;.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteUser(user.id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* View Student Modal */}
      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Student Details</DialogTitle>
            <DialogDescription>View profile and test result</DialogDescription>
          </DialogHeader>
          {viewUser && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <div className="text-gray-500">Name</div>
                  <div className="font-medium">{viewUser.name}</div>
                </div>
                <div>
                  <div className="text-gray-500">Email</div>
                  <div className="font-medium break-all">{viewUser.email}</div>
                </div>
                <div>
                  <div className="text-gray-500">Phone</div>
                  <div className="font-medium">{viewUser.phoneNumber || '-'}</div>
                </div>
                <div>
                  <div className="text-gray-500">Stream</div>
                  <div className="font-medium">{viewUser.stream || '-'}</div>
                </div>
              </div>

              <div className="pt-2">
                <div className="text-sm text-gray-500 mb-2">Test Result</div>
                {resultLoading ? (
                  <div className="text-sm text-gray-600">Loading...</div>
                ) : resultError ? (
                  <div className="text-sm text-red-600">{resultError}</div>
                ) : !resultData ? (
                  <div className="text-sm">Not attended</div>
                ) : (
                  (() => {
                    const byType = resultData?.details?.byType || {}
                    const order = [
                      'Realistic',
                      'Investigative',
                      'Artistic',
                      'Social',
                      'Enterprising',
                      'Conventional',
                    ]
                    const rows = order.map((k) => ({ type: k, score: Number(byType[k] ?? 0) }))
                    const total = rows.reduce((sum, r) => sum + r.score, 0)
                    return (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Personality Type</TableHead>
                            <TableHead className="text-right">Score</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {rows.map((r) => (
                            <TableRow key={r.type}>
                              <TableCell>{r.type}</TableCell>
                              <TableCell className="text-right font-medium">{r.score}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                        <tfoot>
                          <TableRow>
                            <TableCell className="font-semibold">Total</TableCell>
                            <TableCell className="text-right font-semibold">{total}</TableCell>
                          </TableRow>
                        </tfoot>
                      </Table>
                    )
                  })()
                )}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  )
}
