import { promises as fs } from 'fs'
import path from 'path'

const findFiles = (dirpath: string, paths: string[]):Promise<null> => 
  fs.readdir(dirpath, {withFileTypes: true}).then( (dirents): Promise<null> => 
    Promise.all( dirents.map( dirent => {
      const fp = path.join(dirpath, dirent.name)
      if (dirent.isDirectory()) {
        return findFiles(fp, paths)
      }
      paths.push(fp)
      return Promise.resolve(null)
    })).then( () => null )
  )

export default class FileList {
  private entryDir: string
  constructor(entryDir: string) {
    this.entryDir = entryDir
  }
  async findFiles(): Promise<string[]> {
    const paths: string[] = []
    await fs.mkdir(this.entryDir,{recursive: true})
    await findFiles(this.entryDir, paths)
    return paths
  }
}
