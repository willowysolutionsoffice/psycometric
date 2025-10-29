'use client';
import {
  DialogClose,
} from "@/components/ui/dialog";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  FormDialog,
  FormDialogContent,
  FormDialogDescription,
  FormDialogFooter,
  FormDialogHeader,
  FormDialogTitle,
  FormDialogTrigger,
} from "@/components/ui/form-dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { streamSchema } from "@/schemas/stream-schema";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Stream } from "@/types/stream";

interface StreamFormProps {
  stream?: Stream;
  open?: boolean;
  openChange?: (open: boolean) => void;
}

export const StreamFormDialog = ({ stream, open, openChange }: StreamFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof streamSchema>>({
    resolver: zodResolver(streamSchema),
    defaultValues: {
      name: stream?.name || "",
    },
  });

  const handleSubmit = async (
    values: z.infer<typeof streamSchema>,
    close: () => void
  ) => {
    setIsSubmitting(true);
    try {
      const url = stream
        ? `/api/streams/${stream.id}`
        : `/api/streams`;

      const method = stream ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const response = await res.json();

      if (!res.ok) {
        toast.error(response.error || "Failed to save stream");
        return;
      }

      toast.success(stream ? "Stream updated successfully" : "Stream created successfully");
      close();
      router.refresh();
    } catch (error) {
      console.error("Error saving stream:", error);
      toast.error("Unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <FormDialog
      open={open}
      openChange={openChange}
      form={form}
      onSubmit={(values) => handleSubmit(values, () => openChange?.(false))}
    >
      <FormDialogTrigger asChild>
        <Button>
          <Plus className="size-4 mr-2" />
          Add Stream
        </Button>
      </FormDialogTrigger>

      <FormDialogContent className="sm:max-w-sm">
        <FormDialogHeader>
          <FormDialogTitle>{stream ? "Edit Stream" : "New Stream"}</FormDialogTitle>
          <FormDialogDescription>
            Fill out the stream details. Click save when you&apos;re done.
          </FormDialogDescription>
        </FormDialogHeader>

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Computer Science" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormDialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </DialogClose>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : stream ? "Update" : "Save"}
          </Button>
        </FormDialogFooter>
      </FormDialogContent>
    </FormDialog>
  );
};
