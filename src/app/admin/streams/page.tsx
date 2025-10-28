'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Plus, Edit, Trash2, GraduationCap } from 'lucide-react'
import { toast } from 'sonner'

interface Stream {
  id: string
  name: string
  createdAt: string
  updatedAt: string
}

export default function StreamsPage() {
  const [streams, setStreams] = useState<Stream[]>([])
  const [loading, setLoading] = useState(true)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingStream, setEditingStream] = useState<Stream | null>(null)
  const [formData, setFormData] = useState({
    name: ''
  })

  // Fetch streams
  const fetchStreams = async () => {
    try {
      const response = await fetch('/api/streams')
      if (response.ok) {
        const data = await response.json()
        setStreams(data)
      } else {
        toast.error('Failed to fetch streams')
      }
    } catch (error) {
      toast.error('Error fetching streams')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStreams()
  }, [])

  // Handle create stream
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/streams', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast.success('Stream created successfully')
        setIsCreateDialogOpen(false)
        setFormData({ name: '' })
        fetchStreams()
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to create stream')
      }
    } catch (error) {
      toast.error('Error creating stream')
    }
  }

  // Handle edit stream
  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingStream) return

    try {
      const response = await fetch(`/api/streams/${editingStream.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast.success('Stream updated successfully')
        setIsEditDialogOpen(false)
        setEditingStream(null)
        setFormData({ name: '' })
        fetchStreams()
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to update stream')
      }
    } catch (error) {
      toast.error('Error updating stream')
    }
  }

  // Handle delete stream
  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/streams/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast.success('Stream deleted successfully')
        fetchStreams()
      } else {
        toast.error('Failed to delete stream')
      }
    } catch (error) {
      toast.error('Error deleting stream')
    }
  }

  // Open edit dialog
  const openEditDialog = (stream: Stream) => {
    setEditingStream(stream)
    setFormData({ name: stream.name })
    setIsEditDialogOpen(true)
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Streams Management</h1>
          <p className="text-muted-foreground">Manage academic streams for student registration</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Stream
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Stream</DialogTitle>
              <DialogDescription>
                Add a new academic stream to the system.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreate}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="col-span-3"
                    placeholder="e.g., Computer Science"
                    required
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Create Stream</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5" />
            All Streams
          </CardTitle>
          <CardDescription>
            Manage and organize academic streams for student registration
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading streams...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {streams.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                      No streams found. Create your first stream to get started.
                    </TableCell>
                  </TableRow>
                ) : (
                  streams.map((stream) => (
                    <TableRow key={stream.id}>
                      <TableCell className="font-medium">{stream.name}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openEditDialog(stream)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="outline" size="sm">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. This will permanently delete the stream
                                  "{stream.name}" and remove it from the system.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(stream.id)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Stream</DialogTitle>
            <DialogDescription>
              Update the stream information.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEdit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-name" className="text-right">
                  Name
                </Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="col-span-3"
                  placeholder="e.g., Computer Science"
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Update Stream</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
