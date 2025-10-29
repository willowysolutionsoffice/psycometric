"use client";

import { Stream } from "@/types/stream";
import { StreamFormDialog } from "./stream-form"
import { ColumnDef } from "@tanstack/react-table";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Edit2,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { StreamDeleteDialog } from "./stream-delete-dialog";
import { useState } from "react";

export const streamColumns: ColumnDef<Stream>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      const sort = column.getIsSorted();
      const renderIcon = () => {
        if (!sort) return <ArrowUpDown className="size-4" />;
        if (sort === "asc") return <ArrowUp className="size-4" />;
        if (sort === "desc") return <ArrowDown className="size-4" />;
        return null;
      };

      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(sort === "asc")}
        >
          Name
          {renderIcon()}
        </Button>
      );
    },
    cell: ({ row }) =>  <div className="px-3">{row.getValue('name') as string}</div>,
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) =>
      row.original && <StreamActions stream={row.original} />,
  },
];

export const StreamActions = ({ stream }: { stream: Stream }) => {
  const [openDelete, setOpenDelete] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setOpenEdit(true)}
        className="h-8 w-8 p-0"
      >
        <Edit2 className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setOpenDelete(true)}
        className="h-8 w-8 p-0 text-destructive hover:text-destructive"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
      <StreamFormDialog stream={stream} open={openEdit} openChange={setOpenEdit} />


      {/* Delete Dialog */}
      <StreamDeleteDialog
        stream={stream}
        open={openDelete}
        setOpen={setOpenDelete}
      />
    </div>
  );
};
