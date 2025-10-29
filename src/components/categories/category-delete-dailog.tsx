"use client"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { FC, useState } from "react";
import { Category } from "@prisma/client";
import { Button } from "../ui/button";
import { toast } from "sonner";

export const CategoryDeleteDialog:FC<{
  category: Category,
  open: boolean;
  setOpen: (open: boolean) => void;
}> = ({category, open, setOpen}) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/categories/${category.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success(`Category "${category.name}" deleted successfully.`);
        setOpen(false);
        // Refresh the page to update the list
        window.location.reload();
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to delete category.');
      }
    } catch (error) {
      console.error('Error deleting category:', error);
      toast.error("Failed to delete category.");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete{" "}
            <span className="font-bold">{category.name}</span> category
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button 
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
