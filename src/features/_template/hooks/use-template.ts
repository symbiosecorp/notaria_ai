import { queryOptions } from '@tanstack/react-query'
import { listTemplates, getTemplate } from '../api/template.service'

export const templatesListOptions = () =>
  queryOptions({
    queryKey: ['templates', 'list'],
    queryFn: listTemplates,
  })

export const templateByIdOptions = (id: string) =>
  queryOptions({
    queryKey: ['templates', 'detail', id],
    queryFn: () => getTemplate(id),
    enabled: Boolean(id),
  })
