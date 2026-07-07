import { useMutation } from '@tanstack/react-query'
import {
  analyzeFiles,
  importDrafts,
  processImportFiles,
} from './demo-importacion.service.ts'
import type { ImportDraft } from './schemas.ts'

export function useAnalyzeImportFiles() {
  return useMutation({
    mutationFn: ({
      files,
      onProgress,
    }: {
      files: File[]
      onProgress?: Parameters<typeof analyzeFiles>[1]
    }) => analyzeFiles(files, onProgress),
  })
}

export function useImportDrafts() {
  return useMutation({
    mutationFn: (drafts: ImportDraft[]) => importDrafts(drafts),
  })
}

export function useProcessImportFiles() {
  return useMutation({
    mutationFn: ({
      files,
      onProgress,
    }: {
      files: File[]
      onProgress?: Parameters<typeof processImportFiles>[1]
    }) => processImportFiles(files, onProgress),
  })
}
