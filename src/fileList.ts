import { promises as fs } from 'fs'
import path from 'path'

type DirType = 'entryDir'|'shadowDir'

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
  private shadowDir: string
  constructor(entryDir: string, shadowDir: string) {
    this.entryDir = entryDir
    this.shadowDir = shadowDir
  }
  async findFiles(dirType:DirType): Promise<string[]> {
    const parentDir = dirType === 'entryDir' ? this.entryDir : this.shadowDir
    const paths: string[] = []
    await fs.mkdir(parentDir,{recursive: true})
    await findFiles(parentDir, paths)
    return paths
  }
}
