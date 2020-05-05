`use strict`

const request = require('request-promise-native')
const fs = require('fs').promises
const frontMatter = require('front-matter')
const xmlescape = require('xml-escape')
require('dotenv').config()

const readArticleAsync = async ({user, filePath, articlePath}) => {
  const {attributes, body} = frontMatter( await fs.readFile(filePath, 'utf-8') )

  return `<?xml version="1.0" encoding="utf-8"?>
<entry xmlns="http://www.w3.org/2005/Atom" xmlns:app="http://www.w3.org/2007/app"
       ${ articlePath === undefined ? '' : 'xmlns:opt="http://www.hatena.ne.jp/info/xmlns#hatenablog" ' }
>
  <title>${ attributes.Title || 'No Title' }</title>
  <author><name>name</name></author>
  <content type="text/plain">
   ${ xmlescape(body) }
  </content>
  <updated>${ new Date(attributes.Date).toISOString() || new Date().toISOString() }</updated>
  ${ (attributes.Category || []).map(c => '<category term="'+ c +'" />') }
  <app:control>
    <app:draft>no</app:draft>
  </app:control>
  ${ articlePath === undefined ? '' : '<opt:custom-url>' + articlePath +'</opt:custom-url>' }
</entry>
` 
}

const postArticleAsync = async ({user, blogId, password, filePath, articlePath}) => {
  await request({
//    uri: `https://blog.hatena.ne.jp/${user}/${blogId}/atom/entry`,
    uri: `http://localhost:3000`,
    method: 'POST',
    auth: { user, password },
    json: false,
    body: await readArticleAsync({user, filePath, articlePath})
  })
}

postArticleAsync({
  user: process.env.HATENA_USER,
  password: process.env.HATENA_API_KEY,
  blogId: process.env.HATENA_BLOG_ID,
  filePath: process.argv[2],
  articlePath: process.argv[3]
}).then( () => {
  console.log('Success')
})

