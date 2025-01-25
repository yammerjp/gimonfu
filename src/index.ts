import { createCommand } from 'commander'
import pull from './pull'
import push from './push'
import init from './init'
import ping from './ping'
import newArticle from './new'
const packageJson = require('../package.json')
const program = createCommand();

// Commandline arguments
program
  .version(packageJson.version)
    .option('-d --allow-delete', '[DANGER!!] allow delete local files (pull) or remote articles (push)')
    .option('-g --git-commit-date', "overload local files' last commit date as the file's last updated date")
//    .option('--force', '[DANGER!!] In case of collision, adopt remote article (pull) or localfiles (push)')
//    .option('--dry-run', 'Check only message (Never update and delete local files and remote articles)')

program
  .command('init')
  .description('register credentials to ".gimonfu.json"')
  .action(init)

program
  .command('pull')
  .description('download and update local files')
  .action( () => pull({
    gitCommitDate: (program as any).gitCommitDate,
    allowDelete: (program as any).allowDelete
  }).catch( e => {
    console.error(e.message)
    process.exit(-1)
  }))

program
  .command('push')
  .description('upload and update remote articles')
  .action( () => push({
    gitCommitDate: (program as any).gitCommitDate,
    allowDelete: (program as any).allowDelete
  }).catch( e => {
    console.error(e.message)
    process.exit(-1)
  }))

program
  .command('ping')
  .description('try connection to Hatena-blog AtomPub API server with credentials')
  .action(ping)

program
  .command('new')
  .description('create a new draft article')
  .action(() => newArticle().catch(e => {
    console.error(e.message)
    process.exit(-1)
  }))

program.parse(process.argv)
