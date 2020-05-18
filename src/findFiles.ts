import { promises as fs } from 'fs'
import path from 'path'

const findFilesRecursive = (dirpath: string, paths: string[]):Promise<null> => 
  fs.readdir(dirpath, {withFileTypes: true}).then( (dirents): Promise<null> => 
    Promise.all( dirents.map( dirent => {
      const fp = path.join(dirpath, dirent.name)
      if (dirent.isDirectory()) {
        return findFilesRecursive(fp, paths)
      }
      paths.push(fp)
      return Promise.resolve(null)
    })).then( () => null )
  )

export default async function (dirpath: string): Promise<string[]> {
  const paths: string[] = []
  await fs.mkdir(dirpath,{recursive: true})
  await findFilesRecursive(dirpath, paths)
  return paths
}
