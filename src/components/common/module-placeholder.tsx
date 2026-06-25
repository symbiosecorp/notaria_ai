import { Construction } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "#/components/ui/card"

export interface ModulePlaceholderProps {
  title: string
  description?: string
}

export function ModulePlaceholder({
  title,
  description = "Este módulo aún está en construcción. Aquí aparecerá la funcionalidad completa en la siguiente entrega.",
}: ModulePlaceholderProps) {
  return (
    <Card className="island-shell">
      <CardHeader className="flex flex-row items-center gap-4">
        <div className="flex size-12 items-center justify-center rounded-full bg-lagoon/15">
          <Construction className="size-6 text-lagoon-deep" />
        </div>
        <div>
          <CardTitle>{title}</CardTitle>
          <CardDescription>En construcción</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-sea-ink-soft">{description}</p>
      </CardContent>
    </Card>
  )
}
