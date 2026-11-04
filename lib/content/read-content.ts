import { readFile } from 'node:fs/promises'
import path from 'node:path'

const CONTENT_DIR = path.join(process.cwd(), 'content')

export async function readToolContent(slug: string): Promise<string> {
  return readFile(path.join(CONTENT_DIR, 'tools', `${slug}.mdx`), 'utf8')
}
