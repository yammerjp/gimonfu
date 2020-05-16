const { program } = require('commander')
const packageJson = require('../package.json')
import path from "path"
import AtomPubRequest from './atomPubRequest'
import FileRequest from './fileRequest'
import FileList from './fileList'
import loadConfig from './loadConfig'
import pull from './pull'

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
  const {user_id: user, api_key: password, blog_id: blogId, baseDir} = await loadConfig()
  const entryDir = path.join(baseDir, 'entry')
  return {
    atomPubRequest: new AtomPubRequest(user, password, blogId),
    fileRequest: new FileRequest(entryDir),
    fileList: new FileList(entryDir)
  }
}

const list = async (fileList: FileList) => {
  const paths = await fileList.findFiles()
  paths.map( p => console.log(p) )
  process.exit(0)
}

const push = async () => {
  // delete shadow files
  // download shadow files
  // compare files
  // post and put conflict and new files (with output console)
}

main()

