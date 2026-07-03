export type AppErrorCode =
  | 'AUTH_REQUIRED'
  | 'AUTH_FORBIDDEN'
  | 'NOT_FOUND'
  | 'VALIDATION_ERROR'
  | 'SERVICE_ERROR'
  | 'UNKNOWN_ERROR'

export class AppError extends Error {
  public readonly timestamp: string

  constructor(
    public readonly code: AppErrorCode,
    message: string,
    public readonly feature?: string,
    public readonly cause?: unknown,
  ) {
    super(message)
    this.name = 'AppError'
    this.timestamp = new Date().toISOString()
  }

  toJSON() {
    return {
      name: this.name,
      code: this.code,
      message: this.message,
      feature: this.feature,
      timestamp: this.timestamp,
      cause: this.cause,
    }
  }
}

export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError
}
