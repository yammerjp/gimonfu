import xmlescape from 'xml-escape'
import request from 'request-promise-native'
import { parseStringPromise } from 'xml2js'

class AtomPubRequest {
  user: string
  password: string
  blogId: string
  get entryBaseUrl(): string {
    return `https://blog.hatena.ne.jp/${this.user}/${this.blogId}/atom/entry`
  }
  constructor(user: string, password: string, blogId: string) {
    this.user = user
    this.password = password
    this.blogId = blogId
  }
  fetchXml(urlTail: string):  Promise<string> {
    return request({
      uri: this.entryBaseUrl + urlTail,
      method: 'GET',
      auth: { user: this.user, password: this.password }
    })
  }

  feedEntries2articles(entries: any): Promise<RemoteArticle[]> {
    const tryEntry2Article = (entry:any): RemoteArticle =>{
      const id = entry?.id[0].split('-').pop()
      const url = (entry?.link?.find((e:any)=>e?.$?.rel==='alternate')?.$?.href)
      const customUrl = url.match(/^https:\/\/[^\/]+\/entry\/(.+)$/)[1]
      const title = entry?.title[0]
      const date = new Date( entry?.updated[0] )
      const editedDate = new Date(entry['app:edited'])
      const text = entry?.content[0]._.substring(1)
      const categories = entry?.category?.map((e:any)=>e.$.term) ?? []

      if (
        ![id, customUrl, title, text, ...categories].every(e=> typeof e === 'string')
        || !(date instanceof Date) || isNaN(date.getTime())
        || !(editedDate instanceof Date) || isNaN(editedDate.getTime())
      ) throw new Error('fetched entry is invalid format')
      return { id, customUrl, title, date, editedDate, text, categories }
    }
    try {
      return Promise.resolve( entries.map((e:any) => tryEntry2Article(e)) )
    } catch(e) {
      return Promise.reject(e)
      // return Promise.reject('Fail to parse xml')
    }
  }
  //async fetchPage(page: number|null): Promise<Article[]> {
  async fetchAllArticles(): Promise<RemoteArticle[]> {
    const xml = await this.fetchXml('')
    const { feed } = await parseStringPromise(xml)
    console.log(JSON.stringify(feed))
    return this.feedEntries2articles(feed.entry)
  }
  post(article: LocalArticle) {
    return request({
      uri: `${ this.entryBaseUrl }`,
      method: 'POST',
      auth: { user: this.user, password: this.password },
      json: false,
      body: article2xmlString(article)
    })
  }
}

const article2xmlString = (article: LocalArticle): string => {
  return (
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
` )
}

export default AtomPubRequest

