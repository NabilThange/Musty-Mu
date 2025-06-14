declare module 'formidable' {
  import { IncomingMessage } from 'http'
  import { EventEmitter } from 'events'

  export interface Fields {
    [key: string]: string | string[]
  }

  export interface Files {
    [key: string]: File
  }

  export interface File {
    filepath: string
    mimetype?: string
    originalFilename?: string
    size: number
    newFilename?: string
  }

  export class IncomingForm extends EventEmitter {
    parse(
      req: IncomingMessage, 
      callback: (err: Error | null, fields: Fields, files: Files) => void
    ): void

    parse(req: IncomingMessage): Promise<{ fields: Fields; files: Files }>
  }

  export interface Options {
    keepExtensions?: boolean
    uploadDir?: string
    maxFileSize?: number
    filename?: (name: string, ext: string, part: any) => string
  }

  export function formidable(opts?: Options): IncomingForm
} 