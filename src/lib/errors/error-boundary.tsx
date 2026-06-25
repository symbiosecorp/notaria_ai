import { ErrorComponent  } from '@tanstack/react-router'
import type {ErrorComponentProps} from '@tanstack/react-router';
import { createLogger } from './logger'

export interface AppErrorBoundaryProps extends ErrorComponentProps {
  feature?: string
}

export function AppErrorBoundary({ error, feature }: AppErrorBoundaryProps) {
  const logger = createLogger(feature || 'ui')
  logger.error('Error capturado en boundary', error)

  return (
    <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-6">
      <h2 className="text-lg font-semibold text-destructive">
        Algo salió mal{feature ? ` en ${feature}` : ''}
      </h2>
      <div className="mt-4">
        <ErrorComponent error={error} />
      </div>
    </div>
  )
}
