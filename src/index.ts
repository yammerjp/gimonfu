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
    .command('pull', 'Download and update local files.')
    .command('push', 'Publish and update articles.')
    .option('-ad --allow-delete', 'Allow delete local files(pull) / remote articles(push).')
    .option('--force', 'In case of collision, adopt remote article(pull) / localfiles(push).')
    .option('--dry-run', 'Check only message. (Never update and delete local files and remote articles).')
    .option('-d --download', '(internal operation)download articles')
    .option('-dn --download-newer', '(will delete) download and update local articles')
    .option('-f --file <path>', '(will delete) post a article of markdown file')
    .option('-l --list', '(internal operation) list local article files')

  program.parse(process.argv)

  const {user_id: user, api_key: password, blog_id: blogId, baseDir} = await loadConfig()

  const atomPubRequest = new AtomPubRequest(user, password, blogId)
  const entryDir = path.join(baseDir, 'entry')
  const fileRequest = new FileRequest(entryDir)

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
    const fileList = new FileList(entryDir)
    const paths = await fileList.findFiles()
    paths.map( p => console.log(p) )
    process.exit(0)
  }

  if ( program.listShadow ) {
    const fileList = new FileList(entryDir)
    const paths = await fileList.findFiles()
    paths.map( p => console.log(p) )
    process.exit(0)
  }

  if ( program.download ) {
    const articles = await atomPubRequest.fetchs()
    await Promise.all(articles.map( article => fileRequest.write(article) ))
      .catch( e => console.error(e) )
    process.exit(0)
  }
   
  if ( program.downloadShadow ) {
    const articles = await atomPubRequest.fetchs()
    await Promise.all(articles.map( article => fileRequest.write(article) ))
      .catch( e => console.error(e) )
    process.exit(0)
  }

  if ( program.downloadNewer ) {
    const articles = await atomPubRequest.fetchs()
    await Promise.all(articles.map( article => fileRequest.writeIfNewer(article).then( () =>
      console.log(`updated: ${fileRequest.customUrl2filePath(article.customUrl)}`) )
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

