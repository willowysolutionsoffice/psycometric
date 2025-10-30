import { streamColumns } from "@/components/streams/stream-columns";
import { StreamTable } from "@/components/streams/stream-table";
import { prisma } from "@/lib/prisma";
import { StreamFormDialog } from "@/components/streams/stream-form";

export default async function StreamsPage() {
  const streams = await prisma.stream.findMany();
  const streamsWithStringDates = streams.map(stream => ({
    ...stream,
    createdAt: stream.createdAt.toISOString(),
    updatedAt: stream.updatedAt.toISOString(),
  }));

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Streams</h1>
              <p className="text-muted-foreground">Manage your Streams</p>
            </div>
            <StreamFormDialog />
          </div>
          <StreamTable columns={streamColumns} data={streamsWithStringDates} />
        </div>
      </div>
    </div>
  );
}

