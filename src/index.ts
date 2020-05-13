const { program } = require('commander')
const packageJson = require('../package.json')
import path from "path"
import AtomPubRequest from './atomPubRequest'
import FileRequest from './fileRequest'
import FileList from './fileList'
import loadConfig from './loadConfig'

const main = async () => {
  // Commandline arguments
  program
    .version(packageJson.version)
//    .option('-ad --allow-delete', 'Allow delete local files(pull) / remote articles(push).')
//    .option('--force', 'In case of collision, adopt remote article(pull) / localfiles(push).')
//    .option('--dry-run', 'Check only message. (Never update and delete local files and remote articles).')

  program
    .command('list')
    .description('list local article files')
    .action( async () => {
      const { atomPubRequest, fileRequest, fileList } = await init()
      list(fileList)
    })

  program
    .command('pull')
    .description('Download and update local files.')
    .action( async () => {
      const { atomPubRequest, fileRequest, fileList } = await init()
      pull(atomPubRequest, fileRequest)
    })

//    .command('push', 'Publish and update articles.')

  program.parse(process.argv)
}

const init = async () => {
  const config = await loadConfig().catch( e=> {
    console.error(e.message)
    process.exit(-1)
  })

  const entryDir = path.join(config.baseDir, 'entry')
  return {
    atomPubRequest: new AtomPubRequest(config.user_id, config.api_key, config.blog_id),
    fileRequest: new FileRequest(entryDir),
    fileList: new FileList(entryDir)
  }
}

const list = async (fileList: FileList) => {
  const paths = await fileList.findFiles()
  paths.map( p => console.log(p) )
  process.exit(0)
}

const pull = async (atomPubRequest: AtomPubRequest, fileRequest: FileRequest) => {
  // delete shadow files
  // download shadow files
  // compare files
  // rewrite conflict and old files (with output console)

  const articles = await atomPubRequest.fetchs()
  await Promise.all(articles.map( article => fileRequest.write(article) ))
    .catch( e => console.error(e) )
  process.exit(0)

}

const push = async () => {
  // delete shadow files
  // download shadow files
  // compare files
  // post and put conflict and new files (with output console)
}

main()

