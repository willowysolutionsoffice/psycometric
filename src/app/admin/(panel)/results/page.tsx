import { prisma } from '@/lib/prisma'
import { ResultsTable } from '@/components/admin/results-table'

export default async function AdminResultsPage() {
  const results = await prisma.result.findMany({
    include: { user: true },
    orderBy: { attemptedAt: 'desc' },
  })

  const rows = results.map(r => ({
    id: r.id,
    score: r.score,
    attemptedAt: r.attemptedAt.toISOString(),
    user: { id: r.userId, name: r.user.name, email: r.user.email },
  }))

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Results</h1>
              <p className="text-muted-foreground">Manage student results</p>
            </div>
          </div>
          <ResultsTable data={rows} />
        </div>
      </div>
    </div>
  )
}
