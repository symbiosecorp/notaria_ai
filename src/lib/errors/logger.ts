import { isAppError } from './app-error'

export type LogLevel = 'debug' | 'info' | 'warn' | 'error'

export interface LogEntry {
  level: LogLevel
  feature: string
  message: string
  timestamp: string
  meta?: unknown
  error?: unknown
}

const levelRank: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
}

const envLevel = import.meta.env.VITE_LOG_LEVEL as LogLevel | undefined
const currentLevel: LogLevel = envLevel ?? 'info'

function formatLog(entry: LogEntry) {
  const tag = `[${entry.feature}] ${entry.level.toUpperCase()}`
  const parts = [tag, entry.message]
  if (entry.meta) parts.push(JSON.stringify(entry.meta))
  if (entry.error) {
    if (isAppError(entry.error)) {
      parts.push(JSON.stringify(entry.error.toJSON()))
    } else if (entry.error instanceof Error) {
      parts.push(entry.error.message)
    } else {
      parts.push(JSON.stringify(entry.error))
    }
  }
  return parts.join(' — ')
}

export function createLogger(feature: string) {
  function log(level: LogLevel, message: string, meta?: unknown, error?: unknown) {
    if (levelRank[level] >= levelRank[currentLevel]) {
      const entry: LogEntry = {
        level,
        feature,
        message,
        timestamp: new Date().toISOString(),
        meta,
        error,
      }
      const formatted = formatLog(entry)
      switch (level) {
        case 'debug':
          console.debug(formatted)
          break
        case 'info':
          console.info(formatted)
          break
        case 'warn':
          console.warn(formatted)
          break
        case 'error':
          console.error(formatted)
          break
      }
    }
  }

  return {
    debug: (message: string, meta?: unknown) => log('debug', message, meta),
    info: (message: string, meta?: unknown) => log('info', message, meta),
    warn: (message: string, meta?: unknown) => log('warn', message, meta),
    error: (message: string, error?: unknown, meta?: unknown) =>
      log('error', message, meta, error),
  }
}

export const rootLogger = createLogger('app')
