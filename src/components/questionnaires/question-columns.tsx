"use client";

import { Question } from "@/types/question";
import { QuestionFormDialog } from "./question-form"
import { ColumnDef } from "@tanstack/react-table";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Edit2,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { QuestionDeleteDialog } from "./question-delete-dialog";
import { useState } from "react";

export const questionColumns: ColumnDef<Question>[] = [
  {
    accessorKey: "question",
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
          Question
          {renderIcon()}
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="px-3 max-w-[300px] truncate">
        {row.getValue('question') as string}
      </div>
    ),
  },
  {
    accessorKey: "category.name",
    header: "Category",
    cell: ({ row }) => (
      <div className="px-3">
        {(row.original as Question).category.name}
      </div>
    ),
  },
  {
    accessorKey: "stream.name",
    header: "Stream",
    cell: ({ row }) => (
      <div>
        {(row.original as Question).stream.name}
      </div>
    ),
  },
  {
    accessorKey: "answerKey",
    header: "Answer",
    cell: ({ row }) => (
      <div className="px-3">
        {row.getValue('answerKey') as string}
      </div>
    ),
  },
  {
    accessorKey: "personalityType",
    header: "Personality Type",
    cell: ({ row }) => (
      <div className="px-3">
        {(row.original as Question).personalityType || "-"}
      </div>
    ),
  },
  {
    id: "actions",
    header: () => <div className="text-right px-3">Actions</div>,
    cell: ({ row }) =>
      row.original && <QuestionActions question={row.original} />,
  },
];

const QuestionActions = ({ question }: { question: Question }) => {
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  return (
    <>
      <div className="flex justify-end items-center gap-2">
        {/* Edit Button */}
        <Button
          variant="outline"
          size="icon"
          onClick={() => setOpenEdit(true)}
          title="Edit Question"
          className="h-8 w-8"
        >
          <Edit2 className="h-4 w-4" />
        </Button>

        {/* Delete Button */}
        <Button
          variant="outline"
          size="icon"
          onClick={() => setOpenDelete(true)}
          title="Delete Question"
          className="h-8 w-8 text-destructive hover:text-destructive"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      {/* Edit Dialog */}
      <QuestionFormDialog
        open={openEdit}
        openChange={setOpenEdit}
        question={question}
      />

      {/* Delete Dialog */}
      <QuestionDeleteDialog
        question={question}
        open={openDelete}
        setOpen={setOpenDelete}
      />
    </>
  );
};
