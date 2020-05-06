import { loadFront } from 'yaml-front-matter'
import { promises as fs } from 'fs'

export default class FileRequest {
  baseDir: string
  constructor(baseDir: string) {
    this.baseDir = baseDir
  }
  articlePaths(): string[] {
    return []
  }
  async read(filePath: string, customUrl: string): Promise<Article> {
    const fileString: string = await fs.readFile(filePath, 'utf-8').catch( () => {
      console.error(`Failed to read file ${filePath}`)
      process.exit(1)
    })
    const {title, date, categories, __content: text} = loadFront( fileString )
    return {
      title: title || 'No Title',
      customUrl,
      text,
      date: date || new Date() ,
      categories: categories || []
    }
  }
  write() {
  }
}
