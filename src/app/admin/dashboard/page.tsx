import React from 'react'
import { DashboardStats } from '@/components/admin/dashboard-stats'

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Overview of your psychometric testing platform
        </p>
      </div>
      <DashboardStats />
    </div>
  )
}