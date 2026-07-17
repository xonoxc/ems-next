"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Rectangle } from "recharts"

interface DepartmentChartProps {
   data: { department: string; count: number }[]
}

const COLORS = ["#2563eb", "#16a34a", "#d97706", "#dc2626", "#8b5cf6", "#06b6d4"]

function ColoredBar(props: {
   fill?: string
   payload?: { index: number }
   x?: number
   y?: number
   width?: number
   height?: number
}) {
   const { payload, x, y, width, height } = props
   const fill = COLORS[(payload?.index ?? 0) % COLORS.length]
   return <Rectangle x={x} y={y} width={width} height={height} fill={fill} radius={[4, 4, 0, 0]} />
}

export function DepartmentChart({ data }: DepartmentChartProps) {
   const indexedData = data.map((d, i) => ({ ...d, index: i }))

   return (
      <Card>
         <CardHeader>
            <CardTitle className="text-sm font-medium">Department Distribution</CardTitle>
         </CardHeader>
         <CardContent>
            <ResponsiveContainer width="100%" height={300}>
               <BarChart data={indexedData}>
                  <XAxis dataKey="department" tick={{ fontSize: 12, fill: "var(--foreground)" }} />
                  <YAxis tick={{ fontSize: 12, fill: "var(--foreground)" }} />
                  <Tooltip
                     contentStyle={{
                        backgroundColor: "var(--card)",
                        border: "1px solid var(--border)",
                        borderRadius: "8px",
                        color: "var(--card-foreground)",
                     }}
                     labelStyle={{ color: "var(--card-foreground)" }}
                     itemStyle={{ color: "var(--card-foreground)" }}
                     cursor={{ fill: "var(--muted)", opacity: 0.0 }}
                  />
                  <Bar dataKey="count" shape={<ColoredBar />} />
               </BarChart>
            </ResponsiveContainer>
         </CardContent>
      </Card>
   )
}
