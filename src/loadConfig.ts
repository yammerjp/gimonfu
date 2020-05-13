import path from "path"
import { promises as fs } from 'fs'

interface ConfigFile {
  configString: string
  baseDir: string
}

const loadConfigFile = (dirPath: string): Promise<ConfigFile> => {
  const configPath = path.resolve( dirPath, '.gimonfu.json' );
  return fs.readFile(configPath, 'utf-8')
    .then( configString => { return { configString, baseDir: dirPath} })
    .catch( ()=> {
      const parentDir = path.resolve( dirPath, '../' )
      if ( parentDir === dirPath ) {
        throw new Error('Need .gimonfu.json')
        // root directory までさかのぼっても .gimonfu.jsonが無い
      }
      return loadConfigFile( parentDir )
    })
}

const loadConfig = async () => {
  try {
    const {configString, baseDir} = await loadConfigFile( process.cwd() )
    const config = await JsonParsePromise(configString).catch( e => {
      throw new Error(e)
    })
    if( !config?.user_id || !config?.blog_id || !config?.api_key ) {
      throw new Error('Need user_id, blog_id, api_key in .gimonfu.json')
    }
    return {...config, baseDir}
  } catch(e) {
    return Promise.reject(e)
  }
}

const JsonParsePromise = (str: string): Promise<any> => {
  try {
    const object = JSON.parse(str)
    return Promise.resolve(object)
  } catch {
    return Promise.reject('Failed to parse .gimonfu.json')
  }
}

export default loadConfig

