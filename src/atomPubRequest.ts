import xmlescape from 'xml-escape'
import request from 'request-promise-native'
import { parseStringPromise } from 'xml2js'

type RequestMethod = 'POST'|'GET'

const RequestLimit = 100

interface ArticlePage {
  articles: RemoteArticle[]
  nextPage: string|null
}

class AtomPubRequest {
  private static requestCounter = 0
  private user: string
  private password: string
  private blogId: string
  private get entryBaseUrl(): string {
    return `https://blog.hatena.ne.jp/${this.user}/${this.blogId}/atom/entry`
  }
  constructor(user: string, password: string, blogId: string) {
    this.user = user
    this.password = password
    this.blogId = blogId
  }
  private request(urlTail:string, method: RequestMethod,body?: string): Promise<any> {
    if( ++ AtomPubRequest.requestCounter >  RequestLimit) {
      // リクエストを送りすぎないよう制限
      process.exit(1)
    }
    return request({
      uri: this.entryBaseUrl + urlTail,
      method,
      auth: { user: this.user, password: this.password },
      json: false,
      body
    })
  }
  private fetchXml(urlTail: string): Promise<string> {
    return this.request(urlTail, 'GET')
  }
  private feed2nextPage(feed: any): string|null {
    try {
      const nextPageUrl = feed.link.find((e:any)=>e.$.rel==='next').$.href
      return '' + nextPageUrl.match(/\?page=([0-9]+)$/)[1]
    } catch {
      return null
    }
  }

  private feedEntries2articles(entries: any): Promise<RemoteArticle[]> {
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
  private async fetchPage(page: string|null): Promise<ArticlePage> {
    const urlTail = page === null ? '' : `?page=${page}`
    const xml = await this.fetchXml(urlTail)
    const { feed } = await parseStringPromise(xml)
    console.log(JSON.stringify(feed))
    return {
      nextPage: this.feed2nextPage(feed),
      articles: await this.feedEntries2articles(feed.entry)
    }
  }
  private async fetchPageChain(page: string|null): Promise<RemoteArticle[]> {
    const { nextPage, articles } = await this.fetchPage(page)
    if(nextPage === null) {
      return articles
    }
    return [...articles, ... await this.fetchPageChain(nextPage)]
  }
  async fetchAllArticles(): Promise<RemoteArticle[]> {
    return this.fetchPageChain(null)
  }
  post(article: LocalArticle) {
    return this.request('', 'POST', article2xmlString(article) )
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

