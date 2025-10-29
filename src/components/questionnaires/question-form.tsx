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
import { questionSchema } from "@/schemas/question-schema";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Question, Category, Stream } from "@/types/question";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface QuestionFormProps {
  question?: Question;
  open?: boolean;
  openChange?: (open: boolean) => void;
}

export const QuestionFormDialog = ({ question, open, openChange }: QuestionFormProps) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [streams, setStreams] = useState<Stream[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof questionSchema>>({
    resolver: zodResolver(questionSchema),
    defaultValues: {
      question: question?.question || "",
      answerKey: question?.answerKey || "",
      options: question?.options || ["", "", ""],
      personalityType: question?.personalityType || "",
      streamId: question?.streamId || "",
      categoryId: question?.categoryId || "",
    },
  });

  // Reset form when question prop changes
  useEffect(() => {
    if (question) {
      form.reset({
        question: question.question || "",
        answerKey: question.answerKey || "",
        options: question.options || ["", "", ""],
        personalityType: question.personalityType || "",
        streamId: question.streamId || "",
        categoryId: question.categoryId || "",
      });
    }
  }, [question, form]);

  // Fetch categories and streams
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesRes, streamsRes] = await Promise.all([
          fetch('/api/categories'),
          fetch('/api/streams')
        ]);

        if (categoriesRes.ok) {
          const categoriesData = await categoriesRes.json();
          setCategories(categoriesData);
        }

        if (streamsRes.ok) {
          const streamsData = await streamsRes.json();
          setStreams(streamsData);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (
    values: z.infer<typeof questionSchema>,
    close: () => void
  ) => {
    setIsSubmitting(true);
    try {
      const url = question
        ? `/api/questions/${question.id}`
        : `/api/questions`;

      const method = question ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const response = await res.json();

      if (!res.ok) {
        toast.error(response.error || "Failed to save question");
        return;
      }

      toast.success(question ? "Question updated successfully" : "Question created successfully");
      close();
      router.refresh();
    } catch (error) {
      console.error("Error saving question:", error);
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
          Add Question
        </Button>
      </FormDialogTrigger>

      <FormDialogContent className="sm:max-w-[600px]">
        <FormDialogHeader>
          <FormDialogTitle>{question ? "Edit Question" : "New Question"}</FormDialogTitle>
          <FormDialogDescription>
            Fill out the question details. Click save when you&apos;re done.
          </FormDialogDescription>
        </FormDialogHeader>
            <FormField
              control={form.control}
              name="question"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Question</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter your question here..." 
                      {...field} 
                      rows={3}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent >
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="streamId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stream</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select stream" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {streams.map((stream) => (
                          <SelectItem key={stream.id} value={stream.id}>
                            {stream.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="personalityType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Personality Type</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select personality type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Realistic">Realistic</SelectItem>
                      <SelectItem value="Investigative">Investigative</SelectItem>
                      <SelectItem value="Artistic">Artistic</SelectItem>
                      <SelectItem value="Social">Social</SelectItem>
                      <SelectItem value="Enterprising">Enterprising</SelectItem>
                      <SelectItem value="Conventional">Conventional</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-2">
              <FormLabel>Wrong Answer Options</FormLabel>
              {[0, 1, 2].map((index) => (
                <FormField
                  key={index}
                  control={form.control}
                  name={`options.${index}`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input 
                          placeholder={`Wrong Answer ${index + 1}`} 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
            </div>

            <FormField
              control={form.control}
              name="answerKey"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Correct Answer</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter the correct answer" {...field} />
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
            {isSubmitting ? "Saving..." : question ? "Update" : "Save"}
          </Button>
        </FormDialogFooter>
      </FormDialogContent>
    </FormDialog>
  );
};
