"use client";

import type { AnalysisResult } from "@/lib/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { BadgeCheck, ThumbsDown, ThumbsUp } from "lucide-react";
import { Pie, PieChart, Cell } from "recharts";

interface AnalysisResultsProps {
  results: AnalysisResult;
}

const chartConfig = {
  best: {
    label: "Best",
    color: "hsl(var(--accent))",
  },
  worst: {
    label: "Worst",
    color: "hsl(var(--destructive))",
  },
};

export function AnalysisResults({ results }: AnalysisResultsProps) {
  const { grade, bestQualityPercentage, worstQualityPercentage } = results;

  const chartData = [
    { name: "best", value: bestQualityPercentage, fill: chartConfig.best.color },
    { name: "worst", value: worstQualityPercentage, fill: chartConfig.worst.color },
  ];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Analysis Results</CardTitle>
        <CardDescription>
          Here's the AI-powered analysis of your areca nut sample.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-8 sm:grid-cols-2">
        <div className="flex flex-col items-center justify-center space-y-4 rounded-lg bg-card p-6">
          <CardTitle className="flex items-center gap-2 text-center">
            <BadgeCheck className="h-8 w-8 text-primary" />
            <span>Overall Grade</span>
          </CardTitle>
          <p className="text-8xl font-bold text-primary">{grade}</p>
        </div>
        <div className="flex flex-col items-center justify-center space-y-4">
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square h-[180px]"
          >
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    formatter={(value, name) => `${(name as string).charAt(0).toUpperCase() + (name as string).slice(1)}: ${value}%`}
                    hideLabel
                  />
                }
              />
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                innerRadius={60}
                outerRadius={80}
                strokeWidth={2}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
            </PieChart>
          </ChartContainer>
          <div className="flex w-full justify-around text-sm">
            <div className="flex items-center gap-2">
              <span className="flex h-3 w-3 rounded-full" style={{ backgroundColor: chartConfig.best.color }} />
              <p>
                Best:{" "}
                <span className="font-semibold">{bestQualityPercentage}%</span>
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="flex h-3 w-3 rounded-full" style={{ backgroundColor: chartConfig.worst.color }} />
              <p>
                Worst:{" "}
                <span className="font-semibold">{worstQualityPercentage}%</span>
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
