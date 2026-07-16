"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface DepartmentChartProps {
   data: { department: string; count: number }[]
}

const COLORS = ["#2563eb", "#16a34a", "#d97706", "#dc2626", "#8b5cf6", "#06b6d4"]

export function DepartmentChart({ data }: DepartmentChartProps) {
   const total = data.reduce((sum, d) => sum + d.count, 0)

   return (
      <Card>
         <CardHeader>
            <CardTitle className="text-sm font-medium">Department Distribution</CardTitle>
         </CardHeader>
         <CardContent>
            <div className="space-y-3">
               {data.map((item, i) => (
                  <div key={item.department} className="space-y-1">
                     <div className="flex justify-between text-sm">
                        <span>{item.department}</span>
                        <span className="text-muted-foreground">
                           {Math.round((item.count / total) * 100)}%
                        </span>
                     </div>
                     <div className="h-2 rounded-full bg-muted">
                        <div
                           className="h-full rounded-full transition-all"
                           style={{
                              width: `${(item.count / total) * 100}%`,
                              backgroundColor: COLORS[i % COLORS.length],
                           }}
                        />
                     </div>
                  </div>
               ))}
            </div>
         </CardContent>
      </Card>
   )
}
