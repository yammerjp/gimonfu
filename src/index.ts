const { program } = require('commander')
const packageJson = require('../package.json')
import path from "path"
import { promises as fs } from 'fs'
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
    .option('-d --download', '(internal operation)download articles')
    .option('-ds --download-shadow', '(internal operatin) download articles to .gimonfu')
    .option('-f --file <path>', '(will delete) post a article of markdown file')

  const {user_id: user, api_key: password, blog_id: blogId, baseDir} = await loadConfig()

  const atomPubRequest = new AtomPubRequest(user, password, blogId)
  const entryDir = path.join(baseDir, 'entry')
  const shadowDir = path.join(baseDir, '.gimonfu')
  const fileRequest = new FileRequest(entryDir, shadowDir)
  const fileList = new FileList(entryDir, shadowDir)

  program
    .command('pull')
    .description('Download and update local files.')
    .action(async () => {
      const articles = await atomPubRequest.fetchs()
      await Promise.all(articles.map( article => fileRequest.writeIfNewer(article).then( () =>
        console.log(`updated: ${fileRequest.customUrl2filePath(article.customUrl, false)}`) )
      )).catch( e => console.error(e) )
      process.exit(0)
  })

  program
    .command('push')
    .description('Publish and update articles.')
    .action(async () => {
    // delete shadow files
    // download shadow files
    // compare files
    // post and put conflict and new files (with output console)
  })

  program
    .option('-s --shadow', 'list local article files in .gimonfu')
    .command('list')
    .description('Publish and update articles.')
    .action(async () => {
      const paths = await fileList.findFiles(program.shadow ? 'shadowDir' : 'entryDir' )
      paths.map( p => console.log(p) )
      process.exit(0)
  })

  program.parse(process.argv)

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

  if (typeof program.file === 'string') {
    const fileFullPath = path.resolve(process.cwd(),program.file)
    if (!fileFullPath) {
      console.error('Need -f option')
    }
    const article = await fileRequest.read(fileFullPath)

    await atomPubRequest.post(article)
    console.log('Success')
  }
}

main()

