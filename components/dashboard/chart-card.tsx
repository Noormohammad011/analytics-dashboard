import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { cn } from "@/lib/utils"

type ChartCardProps = {
  title: string
  description?: string
  children: React.ReactNode
  className?: string
}

export const ChartCard = ({
  title,
  description,
  children,
  className,
}: ChartCardProps) => {
  return (
    <Card className={cn(className)}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description ? <CardDescription>{description}</CardDescription> : null}
      </CardHeader>
      <CardContent className="min-h-[240px] md:min-h-[320px]">{children}</CardContent>
    </Card>
  )
}
