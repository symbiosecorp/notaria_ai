import { Upload, X } from 'lucide-react'
import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'

export interface FileUploadZoneProps {
  files: File[]
  onFilesChange: (files: File[]) => void
  disabled?: boolean
}

function fileKey(file: File) {
  return `${file.name}-${file.size}-${file.lastModified}`
}

export function FileUploadZone({
  files,
  onFilesChange,
  disabled,
}: FileUploadZoneProps) {
  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(event.target.files ?? [])
    const merged = [...files]

    for (const file of selected) {
      const key = fileKey(file)
      if (!merged.some((existing) => fileKey(existing) === key)) {
        merged.push(file)
      }
    }

    onFilesChange(merged)
    event.target.value = ''
  }

  function removeFile(index: number) {
    onFilesChange(files.filter((_, i) => i !== index))
  }

  return (
    <div className="rounded-xl border border-dashed border-border bg-muted/20 p-8 text-center">
      <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-lagoon/10 text-lagoon">
        <Upload className="size-5" />
      </div>
      <h3 className="mt-4 text-base font-medium text-sea-ink">
        Sube uno o varios archivos
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Cualquier formato. La demo simula la lectura y va generando expedientes del
        cliente (compraventa, donación, permuta, adjudicación, poder…).
      </p>
      <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
        <Button type="button" variant="outline" disabled={disabled} asChild>
          <label className="cursor-pointer">
            Agregar archivos
            <Input
              type="file"
              multiple
              className="sr-only"
              disabled={disabled}
              onChange={handleChange}
            />
          </label>
        </Button>
        {files.length > 0 && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={disabled}
            onClick={() => onFilesChange([])}
          >
            Limpiar lista
          </Button>
        )}
      </div>
      {files.length > 0 && (
        <ul className="mt-6 space-y-2 text-left text-sm">
          {files.map((file, index) => (
            <li
              key={fileKey(file)}
              className="flex items-center justify-between gap-2 rounded-md border bg-background px-3 py-2"
            >
              <span className="truncate font-medium">{file.name}</span>
              <div className="flex shrink-0 items-center gap-2">
                <span className="text-muted-foreground">
                  {(file.size / 1024).toFixed(1)} KB
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="size-7"
                  disabled={disabled}
                  onClick={() => removeFile(index)}
                  aria-label={`Quitar ${file.name}`}
                >
                  <X className="size-3.5" />
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
