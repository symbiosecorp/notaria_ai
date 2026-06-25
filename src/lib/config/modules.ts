import type { LucideIcon } from 'lucide-react'
import {
  Briefcase,
  Calendar,
  FileText,
  FolderOpen,
  Gavel,
  LayoutDashboard,
  MessageSquareText,
  PieChart,
  Scale,
  Settings,
  ShieldCheck,
  Users,
} from 'lucide-react'

export type ModuleGroup =
  | 'operaciones'
  | 'gobierno'
  | 'inteligencia'
  | 'administracion'

export interface ModuleConfig {
  id: string
  label: string
  path: string
  icon: LucideIcon
  group: ModuleGroup
  permission: string
}

export const modules: ModuleConfig[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    path: '/dashboard',
    icon: LayoutDashboard,
    group: 'operaciones',
    permission: 'dashboard:view',
  },
  {
    id: 'clientes',
    label: 'Clientes',
    path: '/clientes',
    icon: Users,
    group: 'operaciones',
    permission: 'clientes:view',
  },
  {
    id: 'expedientes',
    label: 'Expedientes',
    path: '/expedientes',
    icon: FolderOpen,
    group: 'operaciones',
    permission: 'expedientes:view',
  },
  {
    id: 'honorarios',
    label: 'Honorarios',
    path: '/honorarios',
    icon: Scale,
    group: 'operaciones',
    permission: 'honorarios:view',
  },
  {
    id: 'documental',
    label: 'Gestión Documental',
    path: '/documental',
    icon: FileText,
    group: 'operaciones',
    permission: 'documental:view',
  },
  {
    id: 'registro-publico',
    label: 'Registro Público',
    path: '/registro-publico',
    icon: Gavel,
    group: 'gobierno',
    permission: 'registro_publico:view',
  },
  {
    id: 'fiscal',
    label: 'Fiscal',
    path: '/fiscal',
    icon: Briefcase,
    group: 'gobierno',
    permission: 'fiscal:view',
  },
  {
    id: 'uif',
    label: 'UIF / PLD',
    path: '/uif',
    icon: ShieldCheck,
    group: 'gobierno',
    permission: 'uif:view',
  },
  {
    id: 'agenda',
    label: 'Agenda',
    path: '/agenda',
    icon: Calendar,
    group: 'operaciones',
    permission: 'agenda:view',
  },
  {
    id: 'reportes',
    label: 'Reportes',
    path: '/reportes',
    icon: PieChart,
    group: 'inteligencia',
    permission: 'reportes:view',
  },
  {
    id: 'ia',
    label: 'Asistente IA',
    path: '/ia',
    icon: MessageSquareText,
    group: 'inteligencia',
    permission: 'ia:view',
  },
  {
    id: 'configuracion',
    label: 'Configuración',
    path: '/configuracion',
    icon: Settings,
    group: 'administracion',
    permission: 'configuracion:view',
  },
]

export const modulesById = Object.fromEntries(
  modules.map((m) => [m.id, m]),
) as Record<string, ModuleConfig>

export const moduleGroups: { id: ModuleGroup; label: string }[] = [
  { id: 'operaciones', label: 'Operaciones' },
  { id: 'gobierno', label: 'Gobierno & Cumplimiento' },
  { id: 'inteligencia', label: 'Inteligencia' },
  { id: 'administracion', label: 'Administración' },
]
