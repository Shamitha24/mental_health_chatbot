
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from "recharts";
import { useIsMobile } from "@/hooks/use-mobile";

interface MoodEntry {
  date: string;
  value: number;
  mood: "great" | "good" | "neutral" | "bad" | "terrible";
}

interface MoodChartProps {
  data: MoodEntry[];
  className?: string;
}

const moodToNumber = {
  "terrible": 1,
  "bad": 2,
  "neutral": 3,
  "good": 4,
  "great": 5
};

const numberToMood = {
  1: "Terrible",
  2: "Bad",
  3: "Neutral",
  4: "Good",
  5: "Great"
};

const MoodChart: React.FC<MoodChartProps> = ({ data, className }) => {
  const isMobile = useIsMobile();
  
  // Format data for the chart
  const chartData = data.map(entry => ({
    date: entry.date,
    value: moodToNumber[entry.mood]
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const value = payload[0].value;
      return (
        <div className="bg-white p-2 rounded-md shadow-md border border-mental-light">
          <p className="text-sm">{`Date: ${label}`}</p>
          <p className="text-sm font-medium text-mental-primary">
            {`Mood: ${numberToMood[value as keyof typeof numberToMood]}`}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className={className}>
      <CardHeader className="pb-0 md:pb-2">
        <CardTitle className="text-lg md:text-xl text-mental-tertiary">Mood History</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={isMobile ? 200 : 250}>
          <BarChart data={chartData} margin={isMobile ? { top: 10, right: 10, left: 0, bottom: 20 } : { top: 10, right: 30, left: 0, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5DEFF" />
            <XAxis dataKey="date" />
            <YAxis 
              domain={[1, 5]} 
              ticks={[1, 2, 3, 4, 5]} 
              tickFormatter={(value) => isMobile ? value.toString() : numberToMood[value as keyof typeof numberToMood]} 
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              dataKey="value" 
              fill="#9b87f5" 
              radius={[4, 4, 0, 0]}
              barSize={isMobile ? 20 : 30}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default MoodChart;
