const { program } = require('commander')
const packageJson = require('../package.json')
import path from "path"
import { promises as fs } from 'fs'
import AtomPubRequest from './atomPubRequest'
import FileRequest from './fileRequest'

interface ConfigFile {
  content: string
  baseDir: string
}

const loadConfigFile = (dirPath: string): Promise<ConfigFile> => {
  const configPath = path.resolve( dirPath, '.gimonfu.json' );
  return fs.readFile(configPath, 'utf-8')
    .then( str => { return { content: str, baseDir: dirPath} })
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
  const {content: configString, baseDir} = await loadConfigFile( process.cwd() )
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

const main = async () => {
  // Commandline arguments
  program
    .version(packageJson.version)
    .requiredOption('-f --file <path>', 'post a article of markdown file')
    .option('-c --custom-url <string>','specify custom-url to post\n( ex: https://<user>.hatenablog.com/entry/<string> )')

  program.parse(process.argv)

  const {user_id: user, api_key: password, blog_id: blogId, baseDir} = await loadConfig()
  const filePath = program.file
  const articlePath = program.customUrl

  const atomPubRequest = new AtomPubRequest(user, password, blogId)
  const fileRequest = new FileRequest(baseDir)

  const article = await fileRequest.read(filePath, articlePath)

  await atomPubRequest.post(article)
  console.log('Success')
}

main()

