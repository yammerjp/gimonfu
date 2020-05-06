import postArticleAsync from './post'

const { program } = require('commander')
const packageJson = require('../package.json')
import path from "path"
import { promises as fs } from 'fs'

const loadConfigFile = (dirPath: string): Promise<string> => {
  const configPath = path.resolve( dirPath, '.gimonfu.json' )
  return fs.readFile(configPath, 'utf-8').catch( ()=> {
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
  const configString: string = await loadConfigFile( process.cwd() )
  try {
    const config = JSON.parse(configString)
    if( !config?.user_id || !config?.blog_id || !config?.api_key ) {
      console.error('Need user_id, blog_id, api_key in .gimonfu.json')
      process.exit(-1)
    }
    return config
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

  const {user_id: user, api_key: password, blog_id: blogId} = await loadConfig()
  const filePath = program.file
  const articlePath = program.customUrl

  // Post
  await postArticleAsync(user, password, blogId, filePath, articlePath)
  console.log('Success')
}

main()

