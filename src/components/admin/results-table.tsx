"use client"
import { useTransition } from 'react'
import { useRouter } from 'next/navigation'

interface ResultRow {
  id: string
  score: number
  attemptedAt: string
  user: { id: string; name: string; email: string }
}

export function ResultsTable({ data }: { data: ResultRow[] }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const onDelete = async (id: string) => {
    try {
      await fetch(`/api/results/${id}`, { method: 'DELETE' })
      startTransition(() => router.refresh())
    } catch {}
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Attempted</th>
            <th className="px-4 py-2"></th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((row) => (
            <tr key={row.id}>
              <td className="px-4 py-2 text-sm text-gray-900">{row.user.name}</td>
              <td className="px-4 py-2 text-sm text-gray-500">{row.user.email}</td>
              <td className="px-4 py-2 text-sm text-gray-700">{row.score}</td>
              <td className="px-4 py-2 text-sm text-gray-500">{row.attemptedAt}</td>
              <td className="px-4 py-2 text-right">
                <button
                  onClick={() => onDelete(row.id)}
                  disabled={isPending}
                  className="text-red-600 hover:text-red-800 disabled:opacity-50"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}


