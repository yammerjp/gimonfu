import postArticleAsync from './post'

const { program } = require('commander')
const packageJson = require('../package.json')

// Commandline arguments
program
  .version(packageJson.version)
  .requiredOption('-f --file <path>', 'post a article of markdown file')
  .option('-c --custom-url <string>','specify custom-url to post\n( ex: https://<user>.hatenablog.com/entry/<string> )')
  .option('-u --user <string>','hatena ID (prioritize over environment variable "HATENA_USER")')
  .option('-p --password <string>','hatena API key (prioritize over environment variable "HATENA_API_KEY")')
  .option('-b --blog-id <string>','blog ID (prioritize over environment variable "HATENA_BLOG_ID")')

program.parse(process.argv)

const user = program.user || process.env.HATENA_USER
const password = program.password ||  process.env.HATENA_API_KEY
const blogId = program.blogId || process.env.HATENA_BLOG_ID
const filePath = program.file
const articlePath = program.customUrl

// Validation
if ( !user || !password || !blogId || !filePath ) {
  console.error('Need user, password, blog-id, markdown-file-path')
  process.exit(-1)
}

// Post
postArticleAsync(user, password, blogId, filePath, articlePath)
  .then( () => {
    console.log('Success')
})

