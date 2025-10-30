"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ResultRow } from "@/components/results/results-table";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useTransition } from "react";
import { useRouter } from "next/navigation";

export const resultColumns: ColumnDef<ResultRow>[] = [
  {
    accessorKey: "user.name",
    header: "Student",
    cell: ({ row }) => <span>{row.original.user.name}</span>,
  },
  {
    accessorKey: "user.email",
    header: "Email",
    cell: ({ row }) => <span className="text-muted-foreground">{row.original.user.email}</span>,
  },
  {
    accessorKey: "score",
    header: "Score",
    cell: ({ row }) => <span>{row.original.score}</span>,
  },
  {
    accessorKey: "attemptedAt",
    header: "Attempted",
    cell: ({ row }) => <span className="text-muted-foreground">{row.original.attemptedAt}</span>,
  },
  {
    id: "actions",
    header: () => <div className="text-right">Actions</div>,
    cell: ({ row }) => <DeleteAction id={row.original.id} />,
  },
];

function DeleteAction({ id }: { id: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const onDelete = async () => {
    try {
      await fetch(`/api/results/${id}`, { method: "DELETE" });
      startTransition(() => router.refresh());
    } catch {}
  };

  return (
    <div className="flex justify-end">
      <Button
        variant="ghost"
        size="icon"
        onClick={onDelete}
        disabled={isPending}
        className="text-destructive hover:bg-destructive/10"
        title="Delete"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}


