const { program } = require('commander')
const packageJson = require('../package.json')
import path from "path"
import { promises as fs } from 'fs'
import AtomPubRequest from './atomPubRequest'
import FileRequest from './fileRequest'
import FileList from './fileList'

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

const main = async () => {
  // Commandline arguments
  program
    .version(packageJson.version)
    .command('pull', 'Download and update local files.')
    .command('push', 'Publish and update articles.')
//    .option('-ad --allow-delete', 'Allow delete local files(pull) / remote articles(push).')
//    .option('--force', 'In case of collision, adopt remote article(pull) / localfiles(push).')
//    .option('--dry-run', 'Check only message. (Never update and delete local files and remote articles).')
    .option('-d --download', '(internal operation)download articles')
    .option('-ds --download-shadow', '(internal operatin) download articles to .gimonfu')
    .option('-dn --download-newer', '(will delete) download and update local articles')
    .option('-f --file <path>', '(will delete) post a article of markdown file')
    .option('-l --list', '(internal operation) list local article files')
    .option('-ls --list-shadow', '(internal operation) list local article files in .gimonfu')

  program.parse(process.argv)

  const {user_id: user, api_key: password, blog_id: blogId, baseDir} = await loadConfig()

  const atomPubRequest = new AtomPubRequest(user, password, blogId)
  const entryDir = path.join(baseDir, 'entry')
  const shadowDir = path.join(baseDir, '.gimonfu')
  const fileRequest = new FileRequest(entryDir, shadowDir)

  if (program.pull) {
    // delete shadow files
    // download shadow files
    // compare files
    // rewrite conflict and old files (with output console)
  }

  if (program.push) {
    // delete shadow files
    // download shadow files
    // compare files
    // post and put conflict and new files (with output console)
  }

  if ( program.list ) {
    const fileList = new FileList(entryDir, shadowDir)
    const paths = await fileList.findFiles('entryDir')
    paths.map( p => console.log(p) )
    process.exit(0)
  }

  if ( program.listShadow ) {
    const fileList = new FileList(entryDir, shadowDir)
    const paths = await fileList.findFiles('shadowDir')
    paths.map( p => console.log(p) )
    process.exit(0)
  }

  if ( program.download ) {
    const articles = await atomPubRequest.fetchs()
    await Promise.all(articles.map( article => fileRequest.write(article, false) ))
      .catch( e => console.error(e) )
    process.exit(0)
  }
   
  if ( program.downloadShadow ) {
    const articles = await atomPubRequest.fetchs()
    await Promise.all(articles.map( article => fileRequest.write(article, true) ))
      .catch( e => console.error(e) )
    process.exit(0)
  }

  if ( program.downloadNewer ) {
    const articles = await atomPubRequest.fetchs()
    await Promise.all(articles.map( article => fileRequest.writeIfNewer(article).then( () =>
      console.log(`updated: ${fileRequest.customUrl2filePath(article.customUrl, false)}`) )
    )).catch( e => console.error(e) )
    process.exit(0)
  }

  const fileFullPath = path.resolve(process.cwd(),program.file)
  if (!fileFullPath) {
    console.error('Need -f option')
  }
  const article = await fileRequest.read(fileFullPath)

  await atomPubRequest.post(article)
  console.log('Success')
}

main()

