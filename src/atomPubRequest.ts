import xmlescape from 'xml-escape'
import request from 'request-promise-native'

class AtomPubRequest {
  user: string
  password: string
  blogId: string
  get entryPoint(): string {
    return `https://blog.hatena.ne.jp/${this.user}/${this.blogId}/atom`
  }

  constructor(user: string, password: string, blogId: string) {
    this.user = user
    this.password = password
    this.blogId = blogId
  }
  post(article: Article) {
    request({
      uri: this.entryPoint + '/entry',
      method: 'POST',
      auth: { user: this.user, password: this.password },
      json: false,
      body:
`<?xml version="1.0" encoding="utf-8"?>
<entry xmlns="http://www.w3.org/2005/Atom" xmlns:app="http://www.w3.org/2007/app"
  ${ article.customUrl === null ? '' : 'xmlns:opt="http://www.hatena.ne.jp/info/xmlns#hatenablog" ' } >
  <title>${ article.title }</title>
  <author><name>name</name></author>
  <content type="text/plain">${ xmlescape(article.text) }</content>
  <updated>${ article.date.toISOString() }</updated>
  ${ article.categories.map((c:string) => '<category term="'+ c +'" />') }
  <app:control>
    <app:draft>no</app:draft>
  </app:control>
  ${ article.customUrl === null ? '' : '<opt:custom-url>' + article.customUrl +'</opt:custom-url>' }
</entry>
` 
    })
  }
}

export default AtomPubRequest

