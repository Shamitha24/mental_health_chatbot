
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDistanceToNow } from "date-fns";

interface JournalEntry {
  id: string;
  content: string;
  prompt: string;
  timestamp: Date;
}

interface JournalHistoryProps {
  entries: JournalEntry[];
  className?: string;
}

const JournalHistory: React.FC<JournalHistoryProps> = ({ entries, className }) => {
  if (entries.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="text-lg md:text-xl text-mental-tertiary">Journal History</CardTitle>
          <CardDescription>Your past reflections will appear here</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-6">No journal entries yet. Start journaling to see your history.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg md:text-xl text-mental-tertiary">Journal History</CardTitle>
        <CardDescription>Your past reflections</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px] rounded-md">
          <div className="space-y-4 pr-4">
            {entries.map((entry) => (
              <div key={entry.id} className="bg-muted/50 p-4 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <p className="font-medium text-sm text-mental-secondary italic">"{entry.prompt}"</p>
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(entry.timestamp, { addSuffix: true })}
                  </span>
                </div>
                <p className="text-sm">{entry.content}</p>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default JournalHistory;
