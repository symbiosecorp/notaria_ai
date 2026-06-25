import { queryOptions } from '@tanstack/react-query'
import { listClientes, getCliente } from '../api/clientes.service'

export const clientesListOptions = () =>
  queryOptions({
    queryKey: ['clientes', 'list'],
    queryFn: listClientes,
  })

export const clienteByIdOptions = (id: string) =>
  queryOptions({
    queryKey: ['clientes', 'detail', id],
    queryFn: () => getCliente(id),
    enabled: Boolean(id),
  })
