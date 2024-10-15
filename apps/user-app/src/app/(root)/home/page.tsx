"use client";

import { CartesianGrid, LabelList, Line, LineChart, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartData = [
  { month: "January", balance: 10000 },
  { month: "February", balance: 3000 },
  { month: "March", balance: 50000 },
  { month: "April", balance: 22000 },
  { month: "May", balance: 4300 },
  { month: "June", balance: 300 },
];

const chartConfig = {
  balance: {
    label: "balance",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export default function Component() {
  const description = "A line chart with a label";
  return (
    <div className="">
      <div className="text-4xl text-[#6a51a6] pt-8 mb-8 font-bold">Summary</div>
      <Card className=" w-[750px] ml-[150px] ">
        <CardHeader>
          <CardTitle>Average Wallet Balance</CardTitle>
          <CardDescription>January - June 2024</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig}>
            <LineChart
              accessibilityLayer
              data={chartData}
              margin={{
                top: 20,
                left: 12,
                right: 12,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => value.slice(0, 3)}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="line" />}
              />
              <Line
                dataKey="balance"
                type="natural"
                stroke="var(--color-balance)"
                strokeWidth={2}
                dot={{
                  fill: "var(--color-balance)",
                }}
                activeDot={{
                  r: 6,
                }}
              >
                <LabelList
                  position="top"
                  offset={12}
                  className="fill-foreground"
                  fontSize={10}
                />
              </Line>
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
