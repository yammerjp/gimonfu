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
        // root directory までさかのぼっても .gimonfu.jsonが無い
        console.error('Need .gimonfu.json')
        process.exit(-1)
        }
      return loadConfigFile( parentDir )
    })
}

const loadConfig = async () => {
  const {configString, baseDir} = await loadConfigFile( process.cwd() )
  try {
    const config = JSON.parse(configString)
    if( !config?.user_id || !config?.blog_id || !config?.api_key ) {
      console.error('Need user_id, blog_id, api_key in .gimonfu.json')
      process.exit(-1)
    }
    return {...config, baseDir}
  } catch {
    console.error('Failed to parse .gimonfu.json')
    process.exit(-1)
  }
}

export default loadConfig

