const packageJson = require('../package.json')
import path from "path"
import { promises as fs } from 'fs'

interface ConfigFile {
  configString: string
  baseDir: string
}

const loadConfigFile = async (dirPath: string): Promise<ConfigFile> => {
  const dirPathArray = dirPath.split(path.sep)
  const mayBeBaseDirs = dirPathArray.map( (_, i, arr) =>
    arr.slice(0, arr.length - i).join(path.sep)
  )
  for(let baseDir of mayBeBaseDirs) {
    const configPath = path.join( baseDir, '.gimonfu.json' )
    const configString = await fs.readFile(configPath, 'utf-8').catch( () => undefined )
    if ( configString !== undefined ){
      return { configString, baseDir }
    }
  }
  // root directory までさかのぼっても .gimonfu.jsonが無い
  console.error('Need .gimonfu.json')
  process.exit(-1)
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
