import { questionColumns } from "@/components/questionnaires/question-columns";
import { QuestionTable } from "@/components/questionnaires/question-table";
import { prisma } from "@/lib/prisma";
import { QuestionFormDialog } from "@/components/questionnaires/question-form";

export default async function QuestionariesPage() {
  const questions = await prisma.question.findMany({
    include: {
      category: true,
      stream: true,
    },
  });

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Questions</h1>
              <p className="text-muted-foreground">Manage your Questions</p>
            </div>
            <QuestionFormDialog />
          </div>
          <QuestionTable columns={questionColumns} data={questions} />
        </div>
      </div>
    </div>
  );
}

