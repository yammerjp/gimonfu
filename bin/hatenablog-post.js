#!/usr/bin/env node

`use strict`

const { postArticleAsync } = require('./post.js')

const { program } = require('commander')
const packageJson = require('../package.json')

program
  .version(packageJson.version)
  .requiredOption('-p --post <file>', 'post a article of markdown file')
  .option('-c --custom-url <string>','specify custom-url to post\n( ex: https://<your id>.hatenablog.com/entry/<string> )')
  .option('-u --user <string>','hatena ID (prioritize over environment variable "HATENA_USER")')
  .option('-p --password <string>','hatena API key (prioritize over environment variable "HATENA_API_KEY")')
  .option('-b --blog-id <string>','blog ID (prioritize over environment variable "HATENA_BLOG_ID")')

program.parse(process.argv)

postArticleAsync({
  user: program.user || process.env.HATENA_USER,
  password: program.password ||  process.env.HATENA_API_KEY,
  blogId: program.blogId || process.env.HATENA_BLOG_ID,
  filePath: program.post,
  articlePath: program.customUrl
}).then( () => {
  console.log('Success')
})

