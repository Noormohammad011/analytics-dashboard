import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { cn } from "@/lib/utils"

type KpiCardProps = {
  label: string
  value: string
  delta?: string
  deltaTone?: "positive" | "negative" | "neutral"
  className?: string
}

const deltaVariant = (tone: KpiCardProps["deltaTone"]) => {
  if (tone === "positive") return "secondary" as const
  if (tone === "negative") return "destructive" as const
  return "outline" as const
}

export const KpiCard = ({
  label,
  value,
  delta,
  deltaTone = "neutral",
  className,
}: KpiCardProps) => {
  return (
    <Card className={cn(className)}>
      <CardHeader className="flex flex-row items-start justify-between gap-2 pb-2">
        <CardDescription>{label}</CardDescription>
        {delta ? <Badge variant={deltaVariant(deltaTone)}>{delta}</Badge> : null}
      </CardHeader>
      <CardContent>
        <CardTitle className="text-2xl font-semibold tabular-nums tracking-tight">
          {value}
        </CardTitle>
      </CardContent>
    </Card>
  )
}
