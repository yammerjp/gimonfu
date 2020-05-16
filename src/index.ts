const { program } = require('commander')
const packageJson = require('../package.json')
import path from "path"
import AtomPubRequest from './atomPubRequest'
import FileRequest from './fileRequest'
import loadConfig from './loadConfig'
import pull from './pull'
import push from './push'

(async () => {
  // Commandline arguments
  program
    .version(packageJson.version)
//    .option('-ad --allow-delete', 'Allow delete local files(pull) / remote articles(push).')
//    .option('--force', 'In case of collision, adopt remote article(pull) / localfiles(push).')
//    .option('--dry-run', 'Check only message. (Never update and delete local files and remote articles).')

  program
    .command('pull')
    .description('Download and update local files.')
    .action( async () => {
      const { atomPubRequest, fileRequest } = await init()
      pull(atomPubRequest, fileRequest)
    })

  program
    .command('push')
    .description('Upload and update remote articles.')
    .action( async () => {
      const { atomPubRequest, fileRequest } = await init()
      push(atomPubRequest, fileRequest)
    })

  program.parse(process.argv)
})

const init = async () => {
  const {user_id: user, api_key: password, blog_id: blogId, baseDir} = await loadConfig()
  const entryDir = path.join(baseDir, 'entry')
  return {
    atomPubRequest: new AtomPubRequest(user, password, blogId),
    fileRequest: new FileRequest(entryDir),
  }
}
