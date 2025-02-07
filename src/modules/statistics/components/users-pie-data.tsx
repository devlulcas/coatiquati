"use client"

import { TrendingUp } from "lucide-react"
import { LabelList, Pie, PieChart } from "recharts"

import type { Role } from "@/modules/auth/constants/roles"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card"
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/shared/components/ui/chart"

type UsersPieChartData = {
  permission: Role
  count: number
  fill: string
}

const chartConfig = {
  count: {
    label: "Contagem",
  },
  "ADMIN": {
    label: "Admin",
    color: "hsl(var(--chart-1))",
  },
  "USER": {
    label: "Usuário",
    color: "hsl(var(--chart-2))",
  },
  "HIGH_PRIVILEGE_ADMIN": {
    label: "Alta privilégio",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig

export function UsersPieData({ data }: { data: UsersPieChartData[] }) {
  const total = data.reduce((acc, { count }) => acc + count, 0)
  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Usuário por permissão</CardTitle>
        <CardDescription>Nos últimos 12 meses</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px] [&_.recharts-text]:fill-background"
        >
          <PieChart>
            <ChartTooltip
              content={<ChartTooltipContent nameKey="count" hideLabel />}
            />
            <Pie data={data} dataKey="count">
              <LabelList
                dataKey="permission"
                className="fill-background"
                stroke="none"
                fontSize={12}
                formatter={(value: keyof typeof chartConfig) =>
                  chartConfig[value]?.label
                }
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Total de {total} de usuários <TrendingUp className="h-4 w-4" />
        </div>
      </CardFooter>
    </Card>
  )
}
