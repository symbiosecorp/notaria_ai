import { EmptyState } from '#/components/common/empty-state'
import type { Template } from '../schemas'

export interface TemplateListProps {
  items: Template[]
}

export function TemplateList({ items }: TemplateListProps) {
  if (items.length === 0) {
    return <EmptyState title="Sin registros" description="No hay templates registrados." />
  }

  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li key={item.id} className="rounded-md border p-3">
          <p className="font-medium">{item.name}</p>
          <p className="text-xs text-muted-foreground">{item.status}</p>
        </li>
      ))}
    </ul>
  )
}
