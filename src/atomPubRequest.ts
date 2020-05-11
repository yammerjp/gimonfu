import xmlescape from 'xml-escape'
import request from 'request-promise-native'
import { parseStringPromise } from 'xml2js'

type RequestMethod = 'POST'|'GET'|'PUT'

const RequestLimit = 100

interface ArticlePage {
  articles: Article[]
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
    const uri =  this.entryBaseUrl + urlTail
    return request({
      uri,
      method,
      auth: { user: this.user, password: this.password },
      json: false,
      body
    }).catch( () => {
      console.error(`Error: HTTP Request to ${uri} is failed.`)
    })
  }
  private fetchXml(urlTail: string): Promise<string> {
    return this.request(urlTail, 'GET')
  }
  private tryEntry2Article(entry:any): Article {
    const id = (entry?.link?.find((e:any)=>e?.$?.rel==='edit')?.$?.href).split('/').pop()
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
  private entry2article(entry:any): Promise<Article> {
    try {
      return Promise.resolve( this.tryEntry2Article(entry) )
    } catch(e) {
      return Promise.reject(e)
    }
  }
  private feed2page(feed: any): string|null {
    try {
      const nextPageUrl = feed.link.find((e:any)=>e.$.rel==='next').$.href
      return '' + nextPageUrl.match(/\?page=([0-9]+)$/)[1]
    } catch {
      return null
    }
  }
  private feed2articles(feed: any): Promise<ArticlePage> {
    try {
      return Promise.resolve({
        nextPage : this.feed2page(feed),
        articles : feed.entry.map((e:any) => this.tryEntry2Article(e))
      })
    } catch(e) {
      //return Promise.reject(e)
      return Promise.reject('Fail to parse xml')
    }
  }
  private async fetchPageChain(page: string|null): Promise<Article[]> {
    const urlTail = page === null ? '' : `?page=${page}`
    const xml = await this.fetchXml(urlTail)
    const { feed } = await parseStringPromise(xml)
    // console.log(JSON.stringify(feed))
    const { nextPage, articles } = await this.feed2articles(feed)
    if (nextPage === null) {
      return articles
    }
    return [...articles, ...await this.fetchPageChain(nextPage)]
  }
  async fetch(id: string): Promise<Article> {
    const xml = await this.fetchXml('/'+id)
    const { entry } = await parseStringPromise(xml)
    // console.log(JSON.stringify(entry))
    return Promise.resolve( this.entry2article(entry) )
  }
  fetchs(): Promise<Article[]> {
    return this.fetchPageChain(null)
  }
  post(article: Article):Promise<any> {
    return this.request('', 'POST', article2xmlString(article) )
  }
  async put(article: Article): Promise<boolean> {
    if (article.id === undefined) {
      return Promise.resolve(false)
    }
    const remoteArticle = await this.fetch(article.id)
    if ( isShallowEqual(article, remoteArticle)
      || remoteArticle.editedDate.getTime() > article.editedDate.getTime()
    ) {
      return Promise.resolve(false)
    }
    return this.request(`/${article.id}`, 'PUT', article2xmlString(article)).then( () => true )
  }
  puts(articles: Article[]): Promise<boolean> {
    return Promise.all( articles.map( article => {
      if (article.id === undefined) {
        return this.post(article)
      }
      return this.put(article)
    })).then( () => true)
  }
}

const article2xmlString = (article: Article): string => {
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

const isShallowEqual = (x: any, y: any): boolean => {
  return [...Object.keys(x), ...Object.keys(x)].every( (key:string) => 
    x[key] === y[key]
  )
}

export default AtomPubRequest

