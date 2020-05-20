import { program } from 'commander'
import pull from './pull'
import push from './push'
import init from './init'
import ping from './ping'
const packageJson = require('../package.json')

// Commandline arguments
program
  .version(packageJson.version)
//    .option('-ad --allow-delete', 'Allow delete local files(pull) / remote articles(push).')
    .option('-g --git-commit-date', "overload local files' last commit date as the file's last updated date.")
//    .option('--force', 'In case of collision, adopt remote article(pull) / localfiles(push).')
//    .option('--dry-run', 'Check only message. (Never update and delete local files and remote articles).')

program
  .command('init')
  .description('register credentials to ".gimonfu.json".')
  .action(init)

program
  .command('pull')
  .description('download and update local files.')
  .action( () => pull({gitCommitDate: program.gitCommitDate}).catch( e => {
    console.error(e.message)
    process.exit(-1)
  }))

program
  .command('push')
  .description('upload and update remote articles.')
  .action( () => push({gitCommitDate: program.gitCommitDate}).catch( e => {
    console.error(e.message)
    process.exit(-1)
  }))

program
  .command('ping')
  .description('try connection to Hatena-blog AtomPub API server with credentials.')
  .action(ping)

program.parse(process.argv)
